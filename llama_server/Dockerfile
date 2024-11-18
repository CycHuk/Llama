ARG CUDA_IMAGE="12.5.0-devel-ubuntu22.04"
FROM nvidia/cuda:${CUDA_IMAGE}

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y git build-essential \
    python3 python3-pip gcc wget \
    ocl-icd-opencl-dev opencl-headers clinfo \
    libclblast-dev libopenblas-dev \
    && mkdir -p /etc/OpenCL/vendors && echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd

ENV CUDA_DOCKER_ARCH=all
ENV GGML_CUDA=1

ENV CMAKE_ARGS="-DGGML_CUDA=on"
ENV FORCE_CMAKE=1

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --upgrade pip pytest cmake scikit-build setuptools sse-starlette pydantic-settings starlette-context python-dotenv pika
RUN pip install llama-cpp-python --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cu125

RUN ln -s /usr/bin/python3 /usr/bin/python

COPY . .

RUN which python3

ENTRYPOINT python3 worker.py
