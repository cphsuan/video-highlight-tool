import { describe, it, expect } from 'vitest'
import { fetchTranscript } from '@/lib/api/transcript'

describe('transcript api contract', () => {
  it('should return transcript data', async () => {
    const { transcript, videoUrl } = await fetchTranscript('sample-job')

    expect(transcript).toBeDefined()
    expect(transcript.videoId).toBe('sample_subtitle')
    expect(transcript.title).toBe('Auto Generated Transcript')
    expect(transcript.duration).toBeGreaterThan(0)
    expect(transcript.sections).toBeInstanceOf(Array)
    expect(transcript.sections.length).toBeGreaterThan(0)
    expect(videoUrl).toBe('/sample_video.mp4')
  })

  it('should have valid section structure', async () => {
    const { transcript } = await fetchTranscript('sample-job')
    const firstSection = transcript.sections[0]

    expect(firstSection).toHaveProperty('id')
    expect(firstSection).toHaveProperty('title')
    expect(firstSection).toHaveProperty('sentences')
    expect(firstSection.sentences).toBeInstanceOf(Array)
  })

  it('should have valid sentence structure', async () => {
    const { transcript } = await fetchTranscript('sample-job')
    const firstSentence = transcript.sections[0].sentences[0]

    expect(firstSentence).toHaveProperty('id')
    expect(firstSentence).toHaveProperty('start')
    expect(firstSentence).toHaveProperty('end')
    expect(firstSentence).toHaveProperty('text')
    expect(firstSentence).toHaveProperty('isHighlight')
    expect(typeof firstSentence.start).toBe('number')
    expect(typeof firstSentence.end).toBe('number')
    expect(typeof firstSentence.text).toBe('string')
    expect(typeof firstSentence.isHighlight).toBe('boolean')
  })

  it('should simulate delay', async () => {
    const startTime = Date.now()
    await fetchTranscript('sample-job')
    const endTime = Date.now()
    const duration = endTime - startTime

    expect(duration).toBeGreaterThanOrEqual(300)
    expect(duration).toBeLessThan(1500)
  })
})
