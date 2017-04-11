var scraperjs = require('scraperjs');
var iconv = require('iconv-lite');

function getRequest(url) {
	return {
                url: url,
                headers: {
                      'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Venue 7 3740 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Safari/537.36'
                },
                encoding: "binary"
        };
}

for(var i = 1; i <= 136; i++) {

	scraperjs.StaticScraper.create().request(getRequest('http://www.edb.cz/katalog-firem/zemedelstvi-a-lesnictvi/chov-zvirat/hospodarska-zvirata/?p=' + i + '&ext=16'))
	.scrape(function($) {
		return $('#divFirmy h2>a:not(.neklient)').map(function() {
			return $(this).attr('href');
		}).get();
	})
	.then(function(companyLinks) {
		

		companyLinks.map(function(companyLink) {

			scraperjs.StaticScraper.create().request(getRequest(companyLink))
				.scrape(function($) {
					return $("p.headContact").map(function() {
						var t = $(this);
	
						return {
							'company': $('#h1Nadpis').text(),
							'street': $(t.find('strong')[0]).text(),
							'email': $(t.find('a')[0]).text(),
							'description': $('#divUztext').text(),
						};
					}).get();
				})
				.then(function(companyInfo) {
					function decode(str) { return iconv.decode(str, 'win1250'); }

					companyInfo = companyInfo[0];

					console.log(decode(companyInfo.company) + ";" + decode(companyInfo.street) + ";" + decode(companyInfo.email) + ";" + decode(companyInfo.description));

				});
		})
	});
}
