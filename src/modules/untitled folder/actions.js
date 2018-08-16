import {
  SAVE_MUSE_CLIENT,
  SAVE_AUDIO_CONTEXT,
  SAVE_MUSIC_PLAYER,
  UPLOAD_SESSIONS,
  SAVE_SESSION
} from "./constants";

export function saveMuseClient(client) {
  return {
    type: SAVE_MUSE_CLIENT,
    payload: client
  };
}

export function saveMusicPlayer(player) {
  return {
    type: SAVE_MUSIC_PLAYER,
    payload: player
  };
}

export function uploadSessions(allSessions) {
  return {
    type: UPLOAD_SESSIONS,
    allSessions
  };
}

export function saveSession(data) {
  const payload = {
    music: data.state.source,
    eegReadings: data.eegReadings,
    telemetry: data.telemetry,
    acceleration: data.acceleration,
    controlResponses: data.controlResponses,
    gyroscopeData: data.gyroscopeData,
    progress: data.progress
  };
  return {
    type: SAVE_SESSION,
    payload
  };
}

export function saveAudioContext(context) {
  return {
    type: SAVE_AUDIO_CONTEXT,
    payload: context
  };
}
