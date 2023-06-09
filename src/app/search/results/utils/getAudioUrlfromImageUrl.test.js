import getAudioUrlfromImageUrl from './getAudioUrlfromImageUrl';

describe('getAudioUrlfromImageUrl', () => {
  it('returns mp3 url', () => {
    const imageUrl = 'https://example.com/somesite/media.png?start_offset=100&end_offset=200';
    const mp3Url = 'https://example.com/somesite/media.mp3?start_offset=100&end_offset=200';
    expect(getAudioUrlfromImageUrl(imageUrl)).toEqual(mp3Url);
  });
});
