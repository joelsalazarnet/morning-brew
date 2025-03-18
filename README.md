# morning-brew
Google App Script to create a playlist containing the latest videos from your YouTube subscriptions.

## Features

* **Automatic Playlist Generation:** Creates a playlist titled "Latest Videos from Subscriptions (48 Hours)".
* **Recent Videos:** Fetches videos published within the last 48 hours from your subscriptions.
* **Video Duration Filtering:** Filters out YouTube Shorts (videos less than 3 minutes) and videos longer than 40 minutes.
* **Detailed Logging:** Logs progress and errors to the Google Apps Script execution log.
* **Playlist Privacy Control:** Configurable to create public, unlisted, or private playlists.
* **Per-Channel Limit:** Retrieves the 10 most recent videos from each subscribed channel.
* **Playlist ID Storage:** Stores the created playlist ID in user properties.
* **Playlist Deletion:** provides a function to delete the created playlist.
* **Automated Daily Execution:** Uses a time-based trigger to run the playlist creation script daily between 5 AM and 6 AM.
* **Automated Daily Deletion:** Uses a time-based trigger to run the playlist deletion script daily between 11 PM and Midnight (GMT-05:00).

## Prerequisites

* A Google account with a YouTube channel and subscriptions.
* Access to Google Apps Script.
* Enabled YouTube Data API v3 service in your Google Apps Script project.

## Setup

1.  **Open Google Apps Script:**
    * Go to [script.google.com](https://script.google.com/).
    * Create a new script or open an existing one.

2.  **Copy and Paste the Code:**
    * Copy the provided `getLatestVideosFromSubscriptions()`, `isShort()`, `isLong()` and `deletePlaylist()` functions.
    * Paste them into the Google Apps Script editor.

3.  **Enable the YouTube Data API v3:**
    * In the Google Apps Script editor, go to "Services" (the "+" icon next to "Services").
    * Select "YouTube Data API v3" and click "Add".

4.  **Authorize the Script:**
    * Run the `getLatestVideosFromSubscriptions()` or `deletePlaylist()` function.
    * You will be prompted to authorize the script to access your YouTube account.
    * Follow the on-screen instructions to grant the necessary permissions.

5.  **Set up Time-Based Triggers:**
    * In the Google Apps Script editor, click on the "Triggers" icon (the clock icon) on the left sidebar.
    * Click "Add Trigger".
    * **Configure the trigger for `getLatestVideosFromSubscriptions` (Daily Creation):**
        * **Choose which function to run:** Select `getLatestVideosFromSubscriptions`.
        * **Choose which deployment should run:** Select "Head".
        * **Select event source:** Select "Time-driven".
        * **Select type of time based trigger:** Select "Day timer".
        * **Select time of day:** Select "5am to 6am".
        * Click "Save".
    * **Configure the trigger for `deletePlaylist` (Daily Deletion):**
        * Click "Add Trigger" again.
        * **Choose which function to run:** Select `deletePlaylist`.
        * **Choose which deployment should run:** Select "Head".
        * **Select event source:** Select "Time-driven".
        * **Select type of time based trigger:** Select "Day timer".
        * **Select time of day:** Select "11pm to midnight".
        * **Ensure the time zone is set to (GMT-05:00).**
        * Click "Save".

6.  **Viewing the Playlist:**
    * The script will automatically run daily.
    * After the creation trigger has executed, go to your YouTube account and check your playlists.
    * You should see a new playlist titled "Latest Videos from Subscriptions (48 Hours)".
    * You can view the execution logs in the Google Apps Script editor under the executions tab.

## Code Explanation

* **`getLatestVideosFromSubscriptions()`:**
    * Retrieves your YouTube subscriptions.
    * Calculates the date and time 48 hours ago.
    * Iterates through each subscription and searches for recent videos.
    * Filters out YouTube Shorts using the `isShort()` function and videos longer than 40 minutes using the `isLong()` function.
    * Creates a new playlist and adds the filtered videos.
    * Logs progress and errors.
    * Stores the created playlist ID in user properties.
* **`isShort(videoId)`:**
    * Retrieves the duration of a YouTube video.
    * Parses the duration string to calculate the total seconds.
    * Returns `true` if the duration is less than 3 minutes (180 seconds), indicating a Short.
* **`isLong(videoId)`:**
    * Retrieves the duration of a YouTube video.
    * Parses the duration string to calculate the total seconds.
    * Returns `true` if the duration is more than 40 minutes (2400 seconds).
* **`deletePlaylist()`:**
    * Retrieves the playlist ID from user properties.
    * Deletes the playlist if the ID exists.
    * Logs the deletion or the absence of a stored ID.

## Customization

* **Playlist Privacy:**
    * To change the playlist's privacy status, modify the `privacyStatus` property in the `YouTube.Playlists.insert()` call (e.g., `"public"` or `"unlisted"`).
* **Number of Videos per Channel:**
    * Change the `maxResults` value in the `YouTube.Search.list()` call to adjust the number of videos retrieved per channel.
* **Time Period:**
    * Modify the `48 * 60 * 60 * 1000` value in the date calculation to change the time period (e.g., `24 * 60 * 60 * 1000` for 24 hours).
* **Playlist Title and Description:**
    * Modify the `playlistTitle` variable and the `description` property in the `YouTube.Playlists.insert()` call to customize the playlist's metadata.
* **Trigger Frequency:**
    * To change the daily execution time, adjust the trigger settings.

## Error Handling

* The script includes `try...catch` blocks to handle potential errors during API calls and duration parsing.
* Errors are logged to the Google Apps Script execution log.

## Notes

* Ensure that you have a stable internet connection.
* YouTube API quotas may apply.
* This script will only add the specified number of most recent videos per channel.
* The `deletePlaylist()` function relies on the playlist ID being stored in user properties. If the script has not been run to create a playlist, or if the user properties have been cleared, the delete function will not delete a playlist.
* Triggers are subject to Google Apps Script's execution time limits.
* The `deletePlaylist` trigger is set to run at 11 PM to midnight in Lima, Peru time (GMT-05:00). Adjust the time zone if necessary.
