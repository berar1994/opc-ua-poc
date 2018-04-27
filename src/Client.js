class Client {
  constructor(publisher) {
    this.publisher = publisher;
  }
  start() {
    let index = 0;
    setInterval(() => {
      const message = `message_${index}`;

      console.log(`${message} was sent from client...`); // eslint-disable-line
      this.publisher.sendMessage(message);
      index += 1;
    }, 1000);
  }
}

export default Client;
