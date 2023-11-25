

/**
 * Function topicvalidation
 * takes a topic and ensures it is a valid topic
 * @param topic 
 * @returns Array [topic]
 */
const topicValidation = (topic) => {
  const validOptions = ["politics", "health", "sport", "tech"];
  if (typeof topic === "string") {
    const finalTopic = topic;

    const validTest = validOptions.includes(finalTopic.toLowerCase());
    if (validTest == false) {
      return { error: "invalid topic" };
    } else {
      return [finalTopic.toLowerCase()];
    }
  }
  const lowerTopic = topic.map((word) => xss(word.toLowerCase()));
  const validarray = lowerTopic.filter((item) =>
    validOptions.includes(item.toLowerCase())
  );
  if (validarray.length == 0) {
    return { error: "invalid topic" };
  } else {
    return lowerTopic;
  }
};

module.exports = topicValidation;
