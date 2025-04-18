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
