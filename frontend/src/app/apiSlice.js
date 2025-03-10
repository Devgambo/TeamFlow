import axios from 'axios'
import { BASE_URL } from '@/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setUserCredentials, logoutUser } from '../features/auth/authSlice'
import { checkIfTokenNeedsRefresh } from '@/utils/Tokenexp'

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

let isRefreshing = false;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const state = api.getState();
  const accessToken = state.auth.accessToken;
  const refreshToken = state.auth.refreshToken;

  if (accessToken && checkIfTokenNeedsRefresh(accessToken) && !isRefreshing) {
    isRefreshing = true;
    console.info("Token nearing expiry, refreshing...");

    const refreshResult = await baseQuery(
      {
        url: "/api/v1/users/refresh-token",
        method: "POST",
        body: refreshToken,
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.info("Token refreshed successfully");
      api.dispatch(setUserCredentials(refreshResult.data?.data));
    } else {
      console.error("Token refresh failed");
      api.dispatch(logoutUser("Session expired, please login again"));
      window.location.href = "/login";
      isRefreshing = false;
      return refreshResult;
    }

    isRefreshing = false;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error('API Error:', result.error);
    console.error('Status:', result.error.status);
    console.error('Data:', result.error.data);
  }

  if (result.error && result.error.status === 401) {
    console.error("Unauthorized! Logging out...");
    api.dispatch(logoutUser("Session expired, please login again"));
    window.location.href = "/login";
  }

  return result;
};


//this will used if we are calling for any uploads and stuff which takes time..
const fetchBaseQueryWithProgress = ({ baseUrl }) => {
    return async (args, api) => {
      const { url, method, body, headers, onProgress } = args;
      const state = api.getState();
      const accessToken = state.auth.accessToken;
      const source = axios.CancelToken.source();
  
      try {
        const response = await axios({
          method,
          url: `${baseUrl}${url}`,
          data: body,
          headers: { ...headers, Authorization: `Bearer ${accessToken}` },
          cancelToken: source.token,
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              onProgress(progress);
            }
          },
        });
        return { data: response.data };
      } catch (error) {
        return { error: error.response?.data || error.message };
      }
    };
};
  
const dynamicBaseQuery = async (args, api, extraOptions) => {
    const { url, method = "GET", body, headers = {}, useProgress, onProgress } = args;
  
    if (useProgress) {
      return fetchBaseQueryWithProgress({ baseUrl: BASE_URL })({
        url, method, body, headers, onProgress
        }, api, extraOptions);
    }
  
    return baseQueryWithReauth({ url, method, body, headers }, api, extraOptions);
  };
  
export const apiSlice = createApi({
    baseQuery: dynamicBaseQuery,
    endpoints: () => ({}),
});