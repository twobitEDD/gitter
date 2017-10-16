import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default class Cropping extends CommandInterceptor {
  constructor(eventBus, gitterConnectionCropping) {
    super(eventBus);

    function cropConnection(event) {
      const { context } = event;

      if (!context.cropped) {
        const connection = context.connection;
        connection.waypoints = gitterConnectionCropping.getCroppedWaypointsFromConnection(connection);
        context.cropped = true;
      }
    }

    this.executed([
      'connection.layout',
      'connection.create',
      'connection.reconnectEnd',
      'connection.reconnectStart'
    ], cropConnection);
  }
}

Cropping.$inject = [ 'eventBus', 'gitterConnectionCropping' ];