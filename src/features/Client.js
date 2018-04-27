/* eslint-disable */

import opcua from "node-opcua";
import async from "async";

const nodeId = "ns=1;s=Temperature";

class Client {
  async start(endpointUrl) {
    try {
      const client = new opcua.OPCUAClient({
        certificateFile: "./certificates/client_selfsigned_cert_2048.pem",
        privateKeyFile: "./certificates/client_key_2048.pem",
        connectionStrategy: {
          maxRetry: 2,
          initialDelay: 2000,
          maxDelay: 10 * 1000
        }
      });
      client.on("backoff", () => console.log("retrying connection"));

      await client.connect(endpointUrl);

      const session = await client.createSession();

      const browseResult = await session.browse("RootFolder");

      console.log(
        browseResult.references.map(r => r.browseName.toString()).join("\n")
      );

      const dataValue = await session.read({
        nodeId: nodeId,
        attributeId: opcua.AttributeIds.Value
      });
      console.log(` temperature = ${dataValue.value.value.toString()}`);

      // step 5: install a subscription and monitored item
      const subscription = new opcua.ClientSubscription(session, {
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 10,
        requestedMaxKeepAliveCount: 2,
        maxNotificationsPerPublish: 10,
        publishingEnabled: true,
        priority: 10
      });

      subscription
        .on("started", () =>
          console.log(
            "subscription started - subscriptionId=",
            subscription.subscriptionId
          )
        )
        .on("keepalive", () => console.log("keepalive"))
        .on("terminated", () => console.log("subscription terminated"));

      const monitoredItem = subscription.monitor(
        {
          nodeId: "nodeId",
          attributeId: opcua.AttributeIds.Value
        },
        {
          samplingInterval: 1000,
          discardOldest: true,
          queueSize: 10
        }
      );

      monitoredItem.on("changed", dataValue =>
        console.log(` Temperature = ${dataValue.value.value.toString()}`)
      );

      await new Promise(resolve => setTimeout(resolve, 10000));

      await subscription.terminate();

      console.log(" closing session");
      await session.close();

      await client.disconnect();
    } catch (err) {
      console.log("Error !!!", err);
    }
  }
}

export default Client;
