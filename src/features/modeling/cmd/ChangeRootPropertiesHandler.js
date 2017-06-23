class ChangeRootPropertiesHandler {
  execute({ mainPart, properties }) {
    mainPart.setBPM(properties.tempo);
  }

  revert({ mainPart, oldProperties }) {
    mainPart.setBPM(oldProperties.tempo);
  }
}

export default ChangeRootPropertiesHandler;
