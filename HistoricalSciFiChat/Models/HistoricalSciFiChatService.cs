using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace HistoricalSciFiChat.Models
{
	public class HistoricalSciFiChatService
	{
		private readonly HttpClient _httpClient;
		private readonly string API_ENDPOINT;
		private readonly string API_KEY;

		public HistoricalSciFiChatService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
		{
			_httpClient = httpClientFactory.CreateClient();
			API_ENDPOINT = configuration["OpenAI:Endpoint"] ?? "https://api.openai.com/v1/engines/davinci/completions"; // default if not found
			API_KEY = configuration["OpenAI:ApiKey"];

			if (string.IsNullOrWhiteSpace(API_KEY))
				throw new ArgumentNullException("OpenAI API key is not configured.");

			_httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {API_KEY}");
		}

		public async Task<string> GetResponseAsync(string message, string figureName)
		{
			var payload = new
			{
				prompt = $"{figureName}: {message}",
				max_tokens = 150
			};

			HttpResponseMessage response;
			try
			{
				response = await _httpClient.PostAsJsonAsync(API_ENDPOINT, payload);
			}
			catch (HttpRequestException ex)
			{
				// You can log the exception if needed
				throw new Exception("Error contacting OpenAI API.", ex);
			}

			if (!response.IsSuccessStatusCode)
			{
				// Handle different response errors here or log them as required
				throw new Exception($"OpenAI API returned a {response.StatusCode} status code.");
			}

			var responseBody = await response.Content.ReadAsAsync<dynamic>();
			return responseBody.choices[0].text.ToString();
		}
	}
}
