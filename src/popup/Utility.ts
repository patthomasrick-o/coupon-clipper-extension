/**
 * Miscellaneous utilities.
 */
export default class Utility {
  /**
   * Retrieves the current active tab in the current window.
   *
   * @returns A promise that resolves to the current active tab.
   */
  static async getCurrentTab() {
    // Define query options to get the active tab in the current window
    const queryOptions = { active: true, currentWindow: true };

    // Query the tabs API with the specified options and get the first result
    const [tab] = await chrome.tabs.query(queryOptions);

    // Return the active tab
    return tab;
  }
}
