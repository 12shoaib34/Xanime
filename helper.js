// Converts timestamp to seconds (now correctly handles milliseconds)
export const timeToSeconds = (time) => {
  const parts = time.split(":");
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseFloat(s);
  } else if (parts.length === 2) {
    const [m, s] = parts;
    return parseInt(m, 10) * 60 + parseFloat(s);
  }
  return 0;
};

export const parseVTT = (vttText) => {
  const lines = vttText.split(/\r?\n/); // Split by new lines
  const captions = [];
  let tempCaption = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue; // Skip empty lines

    // Match timestamps (e.g., "00:00:01.000 --> 00:00:04.000")
    if (line.includes("-->")) {
      const [start, end] = line.split(" --> ");
      tempCaption = {
        start: timeToSeconds(start),
        end: timeToSeconds(end),
        text: "",
      };
    } else if (tempCaption.text !== undefined) {
      // Subtitle text (can be multiple lines)
      tempCaption.text += line + "<br/>";
    }

    // Push when we reach a blank line or end of file
    if (lines[i + 1] === "" || i === lines.length - 1) {
      if (tempCaption.text) {
        captions.push(tempCaption);
      }
      tempCaption = {};
    }
  }

  return captions;
};

export const fetchVttFile = async (urlVtt) => {
  try {
    const response = await fetch(urlVtt);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Failed to load subtitles", error);
  }
};
