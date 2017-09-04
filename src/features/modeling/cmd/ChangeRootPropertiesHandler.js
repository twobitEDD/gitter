class ChangeRootPropertiesHandler {
  execute({ mainPart, properties }) {
    if (properties.tempo) {
      mainPart.setBPM(properties.tempo);
    }
  }

  revert({ mainPart, oldProperties }) {
    if (oldProperties.tempo) {
      mainPart.setBPM(oldProperties.tempo);
    }
  }
}

export default ChangeRootPropertiesHandler;
