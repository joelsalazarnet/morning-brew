function getLatestVideosFromSubscriptions() {
  try {
    const subscriptions = YouTube.Subscriptions.list('snippet', { mine: true, maxResults: 50 }).items;
    const now = new Date();
    const timeRange = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    const videoIds = []; // Array to store video IDs

    subscriptions.forEach(subscription => {
      const channelId = subscription.snippet.resourceId.channelId;
      const channelTitle = subscription.snippet.title;

      try {
        const searchResults = YouTube.Search.list('snippet', {
          channelId: channelId,
          order: 'date',
          publishedAfter: timeRange.toISOString(),
          type: 'video',
          maxResults: 10 // Get the 10 latest videos of each channel
        }).items;

        if (searchResults.length > 0) {
          Logger.log(`Channel: ${channelTitle}`);
          searchResults.forEach(video => {
            if (!isShort(video.id.videoId) && !isLong(video.id.videoId)) {
              Logger.log(`  - Video: ${video.snippet.title}, Published: ${video.snippet.publishedAt}`);
              videoIds.push(video.id.videoId); //add video id to the array
            } else {
              Logger.log(`  - Skipped Short: ${video.snippet.title}`);
            }
          });
        } else {
          Logger.log(`Channel: ${channelTitle}, No new videos in the last 48 hours.`);
        }
      } catch (channelError) {
        Logger.log(`Error getting videos for channel ${channelTitle}: ${channelError.toString()}`);
      }
    });

    if (videoIds.length > 0) {
      const playlistTitle = "Latest Videos from Subscriptions";
      const playlist = YouTube.Playlists.insert({
        snippet: {
          title: playlistTitle,
          description: "Playlist of latest videos from subscribed channels within the last 48 hours, excluding videos less than 3 minutes."
        },
        status: {
          privacyStatus: "private" // Or "public" or "unlisted"
        }
      }, 'snippet,status');

      videoIds.forEach(videoId => {
        YouTube.PlaylistItems.insert({
          snippet: {
            playlistId: playlist.id,
            resourceId: {
              kind: 'youtube#video',
              videoId: videoId
            }
          }
        }, 'snippet');
      });

      Logger.log(`Playlist "${playlistTitle}" created successfully. Playlist ID: ${playlist.id}`);
      // Store the playlist ID in user properties:
      PropertiesService.getUserProperties().setProperty('appPlaylistId', playlist.id);
    } else {
      Logger.log("No new videos found to add to the playlist.");
    }

  } catch (e) {
    Logger.log("Error: " + e.toString());
  }
}

function isShort(videoId) {
  try {
    const videoDetails = YouTube.Videos.list('contentDetails', {
      id: videoId
    }).items[0].contentDetails;

    const duration = videoDetails.duration;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      return totalSeconds < 180; // 3 minutes = 180 seconds.
    }
    return false; //unable to determine duration.
  } catch (e) {
    Logger.log("Error checking short duration: " + e.toString());
    return false; //error determining, consider it not a short.
  }
}

function deletePlaylist() {
  const playlistId = PropertiesService.getUserProperties().getProperty('appPlaylistId');

  if (playlistId) {
    YouTube.Playlists.remove(playlistId);
    Logger.log(`Playlist ID removed: ${playlistId}`);
    return playlistId; // Optionally return the ID if you need to use it elsewhere
  } else {
    Logger.log("No stored playlist ID found.");
    return null; // Optionally return null to indicate no ID found
  }
}

function isLong(videoId) {
  try {
    const videoDetails = YouTube.Videos.list('contentDetails', {
      id: videoId
    }).items[0].contentDetails;

    const duration = videoDetails.duration;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      return totalSeconds > 2400; // 40 minutes = 2400 seconds.
    }
    return false; //unable to determine duration.
  } catch (e) {
    Logger.log("Error checking long duration: " + e.toString());
    return false; //error determining, consider it not a short.
  }
}