/**
 * Base URL for the JSONPlaceholder API.
 * This is a fake REST API for testing and prototyping.
 */
export const API_URL = "https://jsonplaceholder.typicode.com";

/**
 * Key used to store the authentication token in localStorage.
 * This key is used by the useLocalStorage hook to persist the auth token.
 */
export const AUTH_TOKEN_KEY = "auth-token";

/**
 * The number of items to fetch per page.
 * This is used by the useInfiniteQuery hook to fetch the next page of data.
 */
export const PAGE_SIZE = 10;

/**
 * Constants for test IDs.
 * These are used to identify elements in the UI for testing purposes.
 */
export const TEST_IDS = {
  LOGIN_VIEW: "login-view",
  EMAIL_INPUT: "email-input",
  PASSWORD_INPUT: "password-input",
  SUBMIT_BUTTON: "submit-button",
  LOGOUT_BUTTON: "logout-button",
  ADD_USER_BUTTON: "add-user-button",
  ADD_USER_DIALOG: "add-user-dialog",
  ADD_USER_DIALOG_CANCEL_BUTTON: "add-user-cancel-button",
  ADD_USER_DIALOG_CREATE_BUTTON: "add-user-create-button",
  DELETE_USER_BUTTON: "delete-user-button",
  DELETE_USER_DIALOG: "delete-user-dialog",
  DELETE_USER_DIALOG_CANCEL_BUTTON: "delete-user-cancel-button",
  DELETE_USER_DIALOG_DELETE_BUTTON: "delete-user-delete-button",
  SEARCH_INPUT: "search-input",
  INFINITE_TABLE: "infinite-table",
  INFINITE_TABLE_HEADER: "infinite-table-header",
  INFINITE_TABLE_BODY: "infinite-table-body",
  INFINITE_TABLE_ROW: "infinite-table-row",
  INFINITE_TABLE_LOADING_ROW: "infinite-table-loading-row",
  INFINITE_TABLE_EMPTY_ROW: "infinite-table-empty-row",
  ERROR_ALERT: "error-alert",
  INPUT_FIELD: "input-field",
  LOADING_SPINNER: "loading-spinner",
  EMPTY_STATE_CONTENT: "empty-state-content",
  USER_NAME: "user-name",
  USER_USERNAME: "user-username",
};
