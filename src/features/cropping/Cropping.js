import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

class Cropping extends CommandInterceptor {
  constructor(eventBus, connectionDocking) {
    super(eventBus);

    function cropConnection(event) {
      const { context } = event;

      if (!context.cropped) {
        const connection = context.connection;
        connection.waypoints = connectionDocking.getCroppedWaypoints(connection);
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

Cropping.$inject = [ 'eventBus', 'connectionDocking' ];

// export default doesn't work
module.exports = Cropping;
