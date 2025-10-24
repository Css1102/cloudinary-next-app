// app/api/video-uploads/route.ts

import { execFile } from 'child_process';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

export async function compressVideo(buffer: Buffer): Promise<Buffer> {
  const inputPath = join(tmpdir(), `${randomUUID()}.mp4`);
  const outputPath = join(tmpdir(), `${randomUUID()}-compressed.mp4`);

  await writeFile(inputPath, buffer);

  return new Promise((resolve, reject) => {
    execFile('ffmpeg', [
    '-i', inputPath,
      '-vcodec', 'libx264',
      '-crf', '32',              // Higher CRF = more compression (range: 0–51)
      '-preset', 'ultrafast',    // Faster compression, less CPU
      '-acodec', 'aac',
      '-b:a', '96k',             // Lower audio bitrate
      '-vf', 'scale=640:-2',     // Resize to 640px width, preserve aspect ratio
      '-r', '20',                // Reduce frame rate to 20 fps
      outputPath
    ], async (error) => {
      if (error) return reject(error);
      const compressed = await readFile(outputPath);
      resolve(compressed);
    });
  });
}

