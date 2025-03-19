export function usePrint() {
    const printElement = (elementId) => {
        const prtContent = document.getElementById(elementId)
        if (!prtContent) {
            console.warn(`Элемент #${elementId} не найден`)
            return
        }
 
        const WinPrint = window.open('', '', 'left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0')

        WinPrint.document.write(`
            <html>
                <head>
                    <title>Печать объекта</title>
                    <style>
                        body { font-family: "Open Sans", sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #333; padding: 8px; text-align: left; font-size: 14px; }
                        th { background-color: #f0f0f0; font-weight: bold; width: 40%; }
                        h1, h2, h3 { text-align: center; }
                    </style>
                </head>
                <body>
                    ${prtContent.innerHTML}
                </body>
            </html>
        `)
        
        WinPrint.document.close()
        WinPrint.focus()
        
        setTimeout(() => {
            WinPrint.print()
            WinPrint.close()
        }, 500)
    }

    return {
        printElement
    }
}