import {
	makeApiRequest,
	generateSymbol,
	parseFullSymbol,
} from './helpers.js';

const configurationData = {
    supported_resolutions: ['1D', '1W', '1M'],
    exchanges: [
        {
            value: 'Bitfinex',
            name: 'Bitfinex',
            desc: 'Bitfinex',
        },
        {
            // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
            value: 'Kraken',

            // filter name
            name: 'Kraken',

            // full exchange name displayed in the filter popup
            desc: 'Kraken bitcoin exchange',
        },
    ],
    symbols_types: [
        {
            name: 'crypto',

            // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
            value: 'crypto',
        },
        // ...
    ],
};

async function getAllSymbols() {
    debugger;
	const data = await makeApiRequest('data/v3/all/exchanges');
	let allSymbols = data.Data.map(item => item.symbol);

	return allSymbols;
}

export default {
	onReady: (callback) => {
		console.log('[onReady]: Method call');
		setTimeout(() => callback(configurationData));
	},

	searchSymbols: async (
		userInput,
		exchange,
		symbolType,
		onResultReadyCallback,
	) => {
		console.log('[searchSymbols]: Method call');
		const symbols = await getAllSymbols();
		onResultReadyCallback(symbols);
	},

	resolveSymbol: async (
		symbolName,
		onSymbolResolvedCallback,
		onResolveErrorCallback,
	) => {
		console.log('[resolveSymbol]: Method call', symbolName);
		const symbols = await getAllSymbols();
		const symbolItem = symbols.find(s => s.toLowerCase() === symbolName.toLowerCase());

		if (!symbolItem) {
			console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
			onResolveErrorCallback('cannot resolve symbol');
			return;
		}

		console.log('[resolveSymbol]: Symbol resolved', symbolItem);
		onSymbolResolvedCallback(symbolItem);
	},

	getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        debugger;
		console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
		const urlParameters = {
			token: 'Tpk_aae23baa9af74779993006fb85d15f0f'
		};
		const query = Object.keys(urlParameters)
			.map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
			.join('&');
		try {
			const data = await makeApiRequest(`/stable/stock/${symbolInfo.toLowerCase()}/chart?${query}`);
			if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
				// "noData" should be set if there is no data in the requested period.
				onHistoryCallback([], {
					noData: true,
				});
				return;
			}
			let bars = [];
			data.Data.forEach(bar => {
				bars = [...bars, {
                    time: bar.updated * 1000,
                    low: bar.low,
                    high: bar.high,
                    open: bar.open,
                    close: bar.close,
                }];
			});
			if (firstDataRequest) {
				lastBarsCache.set(symbolInfo.full_name, {
					...bars[bars.length - 1],
				});
			}
			console.log(`[getBars]: returned ${bars.length} bar(s)`);
			onHistoryCallback(bars, {
				noData: false,
			});
		} catch (error) {
			console.log('[getBars]: Get error', error);
			onErrorCallback(error);
		}
	},

};