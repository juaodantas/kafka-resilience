# Kafka-resilience

Nessa POC foi criado um producer que envia as mensagens para o kafka e um consumer para receber essa mensagem. As mensagens são processadas e randomicamente simulam um erro, o consumer tenta realizar um Retry e caso não tenha sucesso envia a mengem, a mensagem é enviada para um topico DLQ.

# Como rodar:

Na pasta principal para rodar o kafka e o zookeeper, execute:

```bash
docker compose up -d
```

Após isso, entre nas pastas do producer e do consumer e execute
```bash
npm start
```