const parseVtt = (text) => {
  let subtitles = [];
  let lines = text.split("\n");

  lines.forEach((line) => {
    let trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (trimmedLine.startsWith("00:")) {
      const [start, end] = trimmedLine.split(" --> ");
      subtitles.push({ start, end, text: "" });
    } else if (subtitles.length) {
      let currentSub = subtitles[subtitles.length - 1];
      currentSub.text += trimmedLine + "\n";
    }
  });

  return subtitles;
};

export const convertTimeToSeconds = (time) => {
  const match = time.match(/(\d+):(\d+)\.(\d+)/);
  return (
    parseInt(match[1], 10) * 60 +
    parseInt(match[2], 10) +
    parseInt(match[3], 10) / 1000
  );
};
