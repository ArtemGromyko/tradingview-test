export async function makeApiRequest(path) {
	try {
		const response = await fetch(`https://sandbox.iexapis.com/stable/${path}`);
		return response.json();
	} catch (error) {
		throw new Error(`CryptoCompare request error: ${error.status}`);
	}
}

export function parseFullSymbol(fullSymbol) {
	const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
	if (!match) {
		return null;
	}

	return {
		exchange: match[1],
		fromSymbol: match[2],
		toSymbol: match[3],
	};
}