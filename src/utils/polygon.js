const normalizeFormat = (polygon) => {
    let reqFormat = []

    if (polygon[0][0]) {
        polygon[0][0].forEach((element) => {
            if (element['latitude'] && element['longitude']) {
                reqFormat.push([element['latitude'], element['longitude']])
            } else {
                reqFormat.push([element[0], element[1]])
            }
        })
    } else {
        polygon[0].forEach((element) => {
            if (element['latitude'] && element['longitude']) {
                reqFormat.push([element['latitude'], element['longitude']])
            } else {
                reqFormat.push([element[0], element[1]])
            }
        })
    }

    return reqFormat
}

export function polygonCenter(polygon) {
    let reqFormat = normalizeFormat(polygon)
    let polygonLength = reqFormat.length
    let polygonPoints = reqFormat || []

    let x = 0,
        y = 0,
        area = 0,
        i,
        j,
        f,
        point1,
        point2

    for (i = 0, j = polygonLength - 1; i < polygonLength; j = i, i += 1) {
        point1 = polygonPoints[i]
        point2 = polygonPoints[j]
        f = point1[0] * point2[1] - point2[0] * point1[1]

        x += (point1[0] + point2[0]) * f
        y += (point1[1] + point2[1]) * f

        area += point1[0] * point2[1]
        area -= point1[1] * point2[0]
    }

    area /= 2

    f = area * 6

    return [x / f, y / f]
}
