import z from "zod";

import { FastifyInstance } from "fastify";
import { voting } from "../../utils/votin-pub-sub";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    { websocket: true },
    (connection, request) => {
      const getPollParams = z.object({
        pollId: z.string().uuid(),
      });

      const { pollId } = getPollParams.parse(request.params);

      voting.subscriber(pollId, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
    }
  );
}
