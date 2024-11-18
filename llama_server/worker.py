import os
import pika
import json
from llama_cpp import Llama
from dotenv import load_dotenv

llm = Llama(
    model_path="models/Meta-Llama-3.1-8B-Instruct-IQ2_M.gguf",
    chat_format="llama-3",
    verbose=False
)

def on_request(ch, method, properties, body):
    request = json.loads(body)  
    response = None

    try:
        if request.get('stream'):
            output = llm.create_chat_completion(**request)

            for chunk in output:
                delta = chunk['choices'][0]['delta']
                if 'content' in delta:
                    partial_response = delta['content']
                    ch.basic_publish(
                        exchange='',
                        routing_key=properties.reply_to,
                        properties=pika.BasicProperties(
                            correlation_id=properties.correlation_id
                        ),
                        body=json.dumps({"content": partial_response})
                    )
            
            ch.basic_publish(
                exchange='',
                routing_key=properties.reply_to,
                properties=pika.BasicProperties(
                    correlation_id=properties.correlation_id
                ),
                body=json.dumps({"status": "streaming_complete"})
            )
        else:
            print(1)
            output = llm.create_chat_completion(**request)
            response = output["choices"][0]["message"]["content"]
            ch.basic_publish(
                exchange='',
                routing_key=properties.reply_to,
                properties=pika.BasicProperties(
                    correlation_id=properties.correlation_id
                ),
                body=json.dumps(response)
            )
            print(2)
    except Exception as e:
        response = {"error": str(e)}
        ch.basic_publish(
            exchange='',
            routing_key=properties.reply_to,
            properties=pika.BasicProperties(
                correlation_id=properties.correlation_id
            ),
            body=json.dumps(response)
        )
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

load_dotenv()

host = os.getenv('RABBITMQ_HOST', 'localhost')  
port = int(os.getenv('RABBITMQ_PORT', 5672))   
user = os.getenv('RABBITMQ_USER', 'guest1')  
password = os.getenv('RABBITMQ_PASSWORD', 'guest1') 

credentials = pika.PlainCredentials(user, password)
connection = pika.BlockingConnection(pika.ConnectionParameters(
    host=host,      
    port=port,      
    credentials=credentials  
))
channel = connection.channel()

channel.queue_declare(queue='rpc_queue')

channel.basic_consume(queue='rpc_queue', on_message_callback=on_request)

print("Ожидание RPC запросов...")
channel.start_consuming()
