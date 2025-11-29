const port = parseInt(process.env.PORT || '3000')

if (isNaN(port)) {
	throw new Error(`Incorrect port: ${port}`)
}

fetch(`http://localhost:${port}/healthcheck`)
	.then((res) => {
		if (res.status >= 500) {
			throw new Error('Service unhealthy', {
				cause: res.body,
			})
		}
	})
	.catch((err) => {
		throw new Error('Service unhealthy', {
			cause: err,
		})
	})
