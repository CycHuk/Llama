import pika
import uuid
import json

class RPCClient:
    def __init__(self, queue_name='rpc_queue', host='localhost', username='guest1', password='guest1'):
        self.queue_name = queue_name
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=host,
                credentials=pika.PlainCredentials(username, password)
            )
        )
        self.channel = self.connection.channel()

        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self._on_response,
            auto_ack=True
        )
        self.response = None
        self.corr_id = None

    def _on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = json.loads(body) 

    def call(self, params):
        self.response = None
        self.corr_id = str(uuid.uuid4()) 

        self.channel.basic_publish(
            exchange='',
            routing_key=self.queue_name,
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id
            ),
            body=json.dumps(params)
        )

        if params.get('stream'):
            def stream_generator():
                while True:
                    self.response = None
                    while self.response is None:
                        self.connection.process_data_events()
                    if self.response.get("status") == "streaming_complete":
                        break
                    yield self.response.get("content", "")

            return stream_generator()

        while self.response is None:
            self.connection.process_data_events()
        return self.response

if __name__ == '__main__':
    client = RPCClient()

    request_data = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that outputs in JSON."},
            {"role": "user", "content": "Who won the world series in 2020?"}
        ],
        "response_format": {
            "type": "json_object",
            "schema": {
                "type": "object",
                "properties": {"team_name": {"type": "string"}},
                "required": ["team_name"],
            },
        },
        "temperature": 0.7,
        "stream": True
    }

    output = client.call(request_data)
    for chunk in output:
            print(chunk, end="")