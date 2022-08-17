import * as React from 'react';
import './index.css';
import { widget } from '../../charting_library';
//import { UDFCompatibleDatafeed } from '../../datafeeds/udf-compatible-datafeed';
import datafeed from '../../datafeed-test/datafeed';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'AAPL',
    	interval: '1D', // default interval
    	fullscreen: true, // displays the chart in the fullscreen mode
    	container: 'tv_chart_container',
    	datafeed: datafeed,
    	library_path: '../../charting_library',
	};

	tvWidget = null;

	constructor(props) {
		super(props);

		this.ref = React.createRef();
	}

	componentDidMount() {
		debugger;
		console.log('adsf');
		const widgetOptions = {
			symbol: 'AAPL', // default symbol
			interval: '1D', // default interval
			fullscreen: true, // displays the chart in the fullscreen mode
			container: this.ref.current,
			datafeed: datafeed,
			library_path: '../../charting_library',
		};

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => {
			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton();
				button.setAttribute('title', 'Click to show a notification popup');
				button.classList.add('apply-common-tooltip');
				button.addEventListener('click', () => tvWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));

				button.innerHTML = 'Check API';
			});
		});
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			<div
				ref={ this.ref }
				className={ 'TVChartContainer' }
			/>
		);
	}
}