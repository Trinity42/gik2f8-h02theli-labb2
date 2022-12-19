/* Klass för att hantera API-förfrågningar mot server (lokalt backend skapat i lektion 5) */
class Api {
  /* Medlemsvariabel url, för att lagra en grund-url till servern. */
  url = '';

  /* När en instans av klassen skapas skickas url in */
  constructor(url) {
    /* Medlemsvariabeln url sätts till den sträng som man skickade in när man skapade en instans av klassen (som görs i script.js). Detta upplägg är för att göra denna klass generell. Tanken är att det ska gå att använda vår api-klass till olika HTTP-anrop, inte bara sådana för våran todo-applikation.   */
    this.url = url;
  }

  /* Metod för att hatera att skapa resurser. Motsvarar ett anrop med metoden POST. 
  
  Create - POST
  */
  create(data) {
    /* Konverterar inskickat JavaScriptobjekt, i vårt fall en uppgift, till en sträng så att den kan skickas över HTTP. */
    const JSONData = JSON.stringify(data);
    /* Log för att se vad som ska skickas och vart det ska skickas */
    console.log(`Sending ${JSONData} to ${this.url}`);

    /* Skapar ett requestobjekt. Requestobjekt finns inbyggda i JavaScript. 
    Till request-objektets konstruktor skickas
    1. URL:en dit man vill göra förfrågan. I vårt fall det som man skickade in när klassen skapades och som lagrades i medlemsvariabeln this.url. 
    2. Ett objekt med konfiguration rörande förfrågan. 
    
    Method har satts till "POST". Eftersom vi här ska skapa något så är POST den metod man vill ha. 

    Body har satts till den sträng som skapades utifrån det objekt som skickades in så att innehållet - body - i förfrågan kommer att innehålla en strängrepresentation av det som vi vill skapa. I fallet med vår todo-applikaiton kommer det att vara den uppgift som vi vill spara till servern. 

    Headers är metadata som beskriver olika saker om själva förfrågan. Headers skickas in i form av ett JavaScript-objekt och här sätts egenskapen content-type för att beskriva på vilket sätt data är formaterat så att servern vet hur det ska avkodas när det packas upp på serversidan. 
      
    */
    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    /* JavaScripts inbyggda funktion fetch är det som används för att göra HTTP-anrop. Fetch tar ett requestobjekt som parameter. Här skickar vi in det requestobjekt som vi skapade direkt ovanför.  */

    /* Fetch är inbyggt i JavaScript och används för HTTP-kommunikation till andra servrar, för att t.ex. hämta data. Här använder vi */
    return (
      /* Fetch är asynkron och vi bearbetar förfrågan och svar i flera olika steg med hjälp av then. Slutligen, när hela "then"-kedjan är färdig, kommer resultatet av det hela att returneras ur denna create-metod. Det är därför hela fetch och alla dess then är omslutna av parenteser och står efter return. Man returnerar alltså hela det uttrycket ut ur metoden.  */
      fetch(request)
        /* När förfrågan skickats kommer först ett svar i ett oläsbart format. Det tas här emot i en parameter som kallas result, så det avkodas med hjälp av metoden json som finns på result-objektet. result.json() är också asynkrion */
        .then((result) => result.json())
        /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, där data då alltså är resultatet av den asynkrona metoden result.json(). */
        .then((data) => data)
        /* Om något i förfrågan eller svaret går fel, fångas det upp här i catch, där information om felet skrivs ut till loggen.  */
        .catch((err) => console.log(err))
    );
  }

  /* Read - GET */
  getAll() {
    /* I detta fetch-anrop behövs inga särskilda inställningar. Fetch kan ta bara url:en som parameter också, istället för att man skapar ett helt request-objekt. */
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  /* Delete = DELETE */
  remove(id) {
    /* Log för att se att rätt uppgift är på väg att tas bort */
    console.log(`Removing task with id ${id}`);
    /*  Något som inte gjordes i L5, som måste Fixas: */

    /* !!Fixa i server/app.js --> res.header('Access-Control-Allow-Methods', '*');, starta om server!! */

    /* Här behövs, precis som vid POST, lite mer inställningar. Fetch behöver dock inte heller här ett requestobjekt. Det går bra att skicka de sakerna som man skulle ha skickat till requestobjektets konstruktor direkt till fetch-funktionen. 

    Det som skickas in som förfrågan är alltså url, som första argument och en uppsättning inställningar i ett objekt, som andra argument. Precis som när POST-requesten skapades ovan, i create ovan. 

    Det enda som finns i objektet, som skickas in som andra argument till fetch, är att sätta method till delete, eftersom det är den HTTP-metoden som ska användas här. 

    Egentligen skulle jag ha kunnat satt exakt samma kedja av then-anrop här som vid create (POST) och getAll (READ), men det är inte helt relevant vad som kommer till baka från ett delete-anrop. 
    */
    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));
  }
}
