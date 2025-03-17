# morning-brew
Google App Script to create a private YouTube playlist containing the latest videos (published within the last 48 hours) from your YouTube subscriptions.

## Features

* Automatically generates a private playlist titled "Latest Videos from Subscriptions (48 Hours)".
* Fetches the latest videos from your subscribed channels within the last 48 hours.
* Filters out YouTube Shorts (videos less than 3 minutes).
* Logs progress and errors to the Google Apps Script execution log.
* Configurable to create public, unlisted, or private playlists.
* Retrieves the 10 most recent videos from each channel.

## Prerequisites

* A Google account with a YouTube channel.
* Access to Google Apps Script.
* Enabled YouTube Data API v3 service in your Google Apps Script project.

## Setup

1.  **Open Google Apps Script:**
    * Go to [script.google.com](https://script.google.com/).
    * Create a new script or open an existing one.

2.  **Copy and Paste the Code:**
    * Copy the provided `getLatestVideosFromSubscriptions()` and `isShort()` functions.
    * Paste them into the Google Apps Script editor.

3.  **Enable the YouTube Data API v3:**
    * In the Google Apps Script editor, go to "Services" (the "+" icon next to "Services").
    * Select "YouTube Data API v3" and click "Add".

4.  **Authorize the Script:**
    * Run the `getLatestVideosFromSubscriptions()` function.
    * You will be prompted to authorize the script to access your YouTube account.
    * Follow the on-screen instructions to grant the necessary permissions.

5.  **Run the Script:**
    * Select the `getLatestVideosFromSubscriptions` function from the function dropdown menu.
    * Click the "Run" button (the play icon).

6.  **View the Playlist:**
    * Once the script has finished running, go to your YouTube account and check your playlists.
    * You should see a new playlist titled "Latest Videos from Subscriptions (48 Hours)".
    * You can view the execution logs in the google apps script editor under the executions tab.

## Code Explanation

* **`getLatestVideosFromSubscriptions()`:**
    * Retrieves your YouTube subscriptions.
    * Calculates the date and time 48 hours ago.
    * Iterates through each subscription and searches for recent videos.
    * Filters out YouTube Shorts using the `isShort()` function.
    * Creates a new playlist and adds the filtered videos.
    * Logs progress and errors.
* **`isShort(videoId)`:**
    * Retrieves the duration of a YouTube video.
    * Parses the duration string to calculate the total seconds.
    * Returns `true` if the duration is less than 3 minutes (180 seconds), indicating a Short.

## Customization

* **Playlist Privacy:**
    * To change the playlist's privacy status, modify the `privacyStatus` property in the `YouTube.Playlists.insert()` call (e.g., `"public"` or `"unlisted"`).
* **Number of Videos per Channel:**
    * Change the `maxResults` value in the `YouTube.Search.list()` call to adjust the number of videos retrieved per channel.
* **Time Period:**
    * Modify the `48 * 60 * 60 * 1000` value in the date calculation to change the time period (e.g., `24 * 60 * 60 * 1000` for 24 hours).
* **Playlist Title and Description:**
    * Modify the `playlistTitle` variable and the `description` property in the `YouTube.Playlists.insert()` call to customize the playlist's metadata.

## Error Handling

* The script includes `try...catch` blocks to handle potential errors during API calls and duration parsing.
* Errors are logged to the Google Apps Script execution log.

## Notes

* Ensure that you have a stable internet connection.
* YouTube API quotas may apply.
* This script will only add the 10 most recent videos per channel.