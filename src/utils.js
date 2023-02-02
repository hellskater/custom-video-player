export const parseVtt = (text) => {
  let subtitles = [];
  let lines = text.split("\n");
  let currentSub = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("00:")) {
      let parts = line.split(" --> ");
      let start = parts[0];
      let end = parts[1];

      currentSub = {
        start: start,
        end: end,
        text: "",
      };
      subtitles.push(currentSub);
    } else if (currentSub) {
      currentSub.text += line + "\n";
    }
  }

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
