export const generateContent = async (model: string, prompt: string) => {
	try {
		const response = await fetch("https://www.blackbox.ai/api/chat", {
			body: JSON.stringify({
				messages: [{ content: prompt, role: "user" }],
				model: model,
			}),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});

		if (!response.ok)
			throw new Error(`BlackBox API error: ${response.statusText}`);

		const data = await response.json();

		return data.choices?.[0]?.message?.content || "";
	} catch (error) {
		throw error;
	}
};
