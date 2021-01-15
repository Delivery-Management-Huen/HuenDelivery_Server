import { IAuthSocket } from '../../interface/request.interface';
import { verifyToken } from '../../lib/token';
import DriverEvent from './driverEvent';
import DriverEventHandler from './driverEventHandler';

export default class DriverEventListener {
  private readonly driverEventHandler: DriverEventHandler;

  constructor() {
    this.driverEventHandler = new DriverEventHandler();
  }

  listen = async (socket: IAuthSocket) => {
    const token = socket.handshake.query['x-access-token'];

    try {
      const decoded = await verifyToken(token);
      const idx: number = decoded['idx'];

      socket.userIdx = idx;

      socket.join(`user-${idx}`);

      socket.on(DriverEvent.SEND_DRIVER_LOCATION,
        (body) => this.driverEventHandler.sendDriverLocation(socket, body));
    }
    catch (err) {
      console.log(err);
      socket.disconnect();
    }
  }
}
