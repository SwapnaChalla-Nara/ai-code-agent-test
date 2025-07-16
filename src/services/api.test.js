import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createUser } from './api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service - createUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should make POST request with correct data', async () => {
    const mockResponse = {
      userId: '123',
      message: 'User created successfully'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    const result = await createUser(userData);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  test('should throw error for 4xx status codes', async () => {
    const errorResponse = {
      error: 'Validation Error',
      message: 'Email already exists'
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => errorResponse,
    });

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    await expect(createUser(userData)).rejects.toThrow('Email already exists');
  });

  test('should throw error for 5xx status codes', async () => {
    const errorResponse = {
      error: 'Server Error',
      message: 'Internal server error'
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => errorResponse,
    });

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    await expect(createUser(userData)).rejects.toThrow('Internal server error');
  });

  test('should throw generic error for network failures', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Network request failed'));

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    await expect(createUser(userData)).rejects.toThrow('An error occurred while creating the user. Please try again later.');
  });

  test('should throw generic error when response json parsing fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };

    await expect(createUser(userData)).rejects.toThrow('An error occurred while creating the user. Please try again later.');
  });
});