const API_BASE = "http://127.0.0.1:8000/api";

export async function getRecommendations(inputText) {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_BASE}/recommend/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ input_text: inputText }),
  });

  return response.json();
}

export async function getHistory() {
  const token = localStorage.getItem("access");

  const response = await fetch(`${API_BASE}/history/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
