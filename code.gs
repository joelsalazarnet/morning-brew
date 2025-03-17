function getLatestVideosFromSubscriptions() {
  try {
    const subscriptions = YouTube.Subscriptions.list('snippet', { mine: true, maxResults: 50 }).items;
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago

    subscriptions.forEach(subscription => {
      const channelId = subscription.snippet.resourceId.channelId;
      const channelTitle = subscription.snippet.title;

      try {
        const searchResults = YouTube.Search.list('snippet', {
          channelId: channelId,
          order: 'date',
          publishedAfter: twoDaysAgo.toISOString(),
          type: 'video',
          maxResults: 5 // Get the 5 latest videos
        }).items;

        if (searchResults.length > 0) {
          Logger.log(`Channel: ${channelTitle}`);
          searchResults.forEach(video => {
            Logger.log(`  - Video: ${video.snippet.title}, Published: ${video.snippet.publishedAt}`);
          });
        } else {
          Logger.log(`Channel: ${channelTitle}, No new videos in the last 48 hours.`);
        }
      } catch (channelError) {
        Logger.log(`Error getting videos for channel ${channelTitle}: ${channelError.toString()}`);
      }
    });
  } catch (e) {
    Logger.log("Error: " + e.toString());
  }
}