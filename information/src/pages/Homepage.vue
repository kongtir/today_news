<template>
	<div class="homepage">
		<x-chart id="high" class="high" :option="option1"></x-chart>
		<x-chart id="highcharts" class="high" :option="option"></x-chart>
		
	</div>
</template>
<script>
	var myvue = {};
	import XChart from '@/components/chart';
	export default{
		data(){
			return{
				option:{},
				option1:{
					chart: {
						type: 'column'
					},
					title: {
						text: '东京，纽约，伦敦，柏林 月平均降雨量'
					},
					subtitle: {
						text: '数据来源: WorldClimate.com'
					},
					xAxis: {
						categories: [
							'一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'
						],
						crosshair: true
					},
					yAxis: {
						min: 0,
						title: {
							text: '降雨量 (mm)'
						}
					},
					tooltip: {
						// head + 每个 point + footer 拼接成完整的 table
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: {
							borderWidth: 0
						}
					},
					series: [{
						name: '东京',
						data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
					}, {
						name: '纽约',
						data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
					}, {
						name: '伦敦',
						data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
					}, {
						name: '柏林',
						data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
					}]
				},
				data:[{
					name: '安装，实施人员',
					data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
				}, {
					name: '工人',
					data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
				}, {
					name: '销售',
					data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
				}, {
					name: '项目开发',
					data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
				}, {
					name: '其他',
					data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
				}],
				other:{
					title: {
						text: ''
					},
					subtitle: {
						text: ''
					},
					yAxis: {
						title: {
							text: ''
						}
					},
					legend: {
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'middle'
					},
					plotOptions: {
						series: {
							label: {
								connectorAllowed: false
							},
							pointStart: 2010
						}
					},
					series:'',
					responsive: {
						rules: [{
							condition: {
								maxWidth: 500
							},
							chartOptions: {
								legend: {
									layout: 'horizontal',
									align: 'center',
									verticalAlign: 'bottom'
								}
							}
						}]
					}
				},
			}
		},
		beforeCreate: function(){
			myvue = this;
		},
		mounted: function(){
			myvue.other.title.text = '2010 ~ 2016 年太阳能行业就业人员发展情况';
			myvue.other.subtitle.text = '数据来源：thesolarfoundation.com';
			myvue.other.series = myvue.data;
			myvue.other.yAxis.title.text = '就业人数';
			myvue.option = myvue.other;
		},
		components:{
			XChart
		}
	}
	
</script>
<style>
	#highcharts{
		width: 1100px;
		margin-top: 10px;
		margin-bottom: 40px;
	}
	#high{
		width: 1100px;
		margin-top: 20px;
	}
	
</style>