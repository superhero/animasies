/*
    Animasies - Javascript animation pack
    Copyright (C) 2011  Erik Landvall
    
    Animasies is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.
 */

/**
 * Klassen håller statiska funktioner för animeringar
 * 
 * @class
 * @static
 */
var Animasies =
{
    /**
     * <u>Gaussian curve / General normal distribution curve / Bell curve /
     * Normalfördelningskurvan</u><br />
     * <br />
     * Funktionen returnerar ett fält med jämt fördelade integers som motsvarar,
     * steg för steg, en animation enligt den så kallade "klock kurvan".<br />
     * <br />
     * Olika variablar som används i funktionen och deras beskrivningar följer
     * här:<br />
     * <br />
     * <b>start</b> = var animationen ska starta.<br />
     * <b>length</b> = Längden. Målet.<br />
     * <b>position</b> = position av kurvan, maxhastighetens position, ifall den
     * ska sluta mer tvärt eller börja snabbare. 0.5 = mitten. variablen ska
     * vara ett decimaltal mellan 0 - 1<br />
     * <b>h</b> = Steglängden.<br />
     * <b>s</b> = standardavvikelsen (bredden på intervallet)<br />
     * Standard avikelsen räknas ut genom halva längden delat med tre:
     * length/2/3 = length/6<br />
     * <b>j</b> = maxhastighetensläge<br />
     * <b>y</b> = normalfördelningskurvan<br />
     * <b>z</b> = cumulativa summan av var:y<br />
     * <b>v</b> = procentuell anpassningsfaktor, så att sista posten i var:u får
     * cumsum = 1<br />
     * <b>u</b> = det nya anpassade fältet med lägeskordinaterna<br />
     * @param length int<br />
     * Längden på animationen
     * @param position float<br />
     * Ett decimaltal mellan 0 - 1 som avgör var kurvan ska ha sin topp.
     * Mitten = 0.5
     *
     * @function
     * @static
     * @return Array
     * @type Array
     */
    bell : function(length,position)
    {
        var h       = length/(((180/3395)*length)+84.09425626),
            s       = length/10,
            j       = length*position,
            x       = [],
            y       = [],
            z,
            v,
            u       = [],
            temp    = length - ( length % h );
            
        for(var n = 0, i = 0; n < temp; n += h, i++)
            x[i] = n;
        x[i] = length;

        // Temporär konstant för att slippa göra samma uträkning gång på gång
        temp = h*(1/(s*(Math.sqrt(2*Math.PI))));
        for(n in x)
            // Normalfördelningen räknas ut och sparas i fältet y
            y[n] = temp * Math.exp(-(Math.pow(x[n]-j,2)/Math.pow(2*s,2)));

        z = Math.cumsum(y);
        v = length/z[z.length-1];

        for(n in z)
            u[n] = Math.round(v * z[n]);

        return u;
    },

    /**
     * Funktionen är till för att animera ett element med en dämpad
     * svängningsrörelse…<br />
     * <br />
     * <u>De parametrar som finns:</u><br />
     * <b>yv</b> integer <br />
     * Ny Y-axel sparad i ett fält, måste avrundas för gämnare slut.<br />
     * <br />
     * <b>r</b> integer <br />
     * Uträkningens resultat för att slippa göra samma uträkning 2 gånger.<br />
     * <br />
     * <b>element</b> Element <br />
     * Det element som ska animeras. Variabeln är en parameter<br />
     * <br />
     * <b>t</b> integer <br />
     * Tid/Klocka / (acceleration).<br />
     * <br />
     * <b>a</b> integer <br />
     * Initsial amplitude / Storlek på första svängningen / (var objektet släpps
     * ifrån).<br />
     * <br />
     * <b>d</b> integer <br />
     * Dämpningen.<br />
     * <br />
     * <b>f</b> integer <br />
     * Frekvens / naturlig svängning / (antal svängningar).<br />
     *
     * @param a int<br />
     * Beskriver var objektet släpps ifrån med pixlar som måttstock.
     * @param d int<br />
     * Dämpningen som oscillationen har. Defaultvärdet är -0.7.<br />
     * <b>OBS!</b> Måste vara ett negativt värde
     *
     * @function
     * @static
     * @return Array
     * @type Array
     */
    dampedOscillation : function(a,d)
    {
        d  = d || -0.7;
        var t  = 0,
            f  = 1.8,
            yv = [],
            r,
            i  = 0,
            setArray = function()
            {
                t      += 0.1;
                r       = a*Math.pow(Math.E,(d*t))*Math.cos((f*t)+Math.PI);
                yv[i++] = Math.round(r);
            };

        do setArray();
        while(Math.abs(r) >= 0.005);

        return yv;
    },

    /**
     * En aniamtion som påminner om när man stänger en rullgardin. Åker först
     * ner lite innan den faller snabbare uppåt.
     * @param distance int<br />
     * Distansen som animationen ska röra sig på
     *
     * @function
     * @static
     * @return Array
     * @type Array
     */
    curtainClose : function(distance)
    {
        var value       = 0,
            t           = 0,
            pull        = 0,
            aniArray    = [];

        while(value < distance)
        {
            t += 0.8;
            pull += 10;
            value = t*t-pull;
            aniArray[aniArray.length] = Math.round(value);
        }
        return aniArray;
    },

    /**
     * Funktionen returnerar en array som motsvarar en animation som liknar
     * att något studsar.<br />
     * <br />
     * <u>De olika variablarna som används i funktionen:</u><br />
     * <ul>
     *  <li>
     *      <b>y</b>    Dynamisk position av elementet
     *  </li>
     *  <li>
     *      <b>v</b>    Dynamisk hastighet
     *  </li>
     *  <li>
     *      <b>iH</b>   Constant , initsial höjd. Var elementet släpps ifrån
     *  </li>
     *  <li>
     *      <b>y0</b>   Dynamisk , Var elementet släpps ifrån, initsial
     *      höjd.
     *  </li>
     *  <li>
     *      <b>v0</b>   Hastigheten vid t=0, (utgångshastigheten). Possetivt
     *      tal säger att man kastar den uppot, samt ett negativt tal säger
     *      att man kastar den neråt. +-0 = att man bara släpper den helt
     *      enkelt.
     *  </li>
     *  <li>
     *      <b>g</b>    Tyngdkraften, dragningskraften. Default värde 9,81.
     *  </li>
     *  <li>
     *      <b>n</b>    Den procent av kraften i decimaltal som finns kvar
     *      då den ska studsa. 1.0 = 100%, det vill säga en gämn studs.
     *  </li>
     *  <li>
     *      <b>s</b>    Constant, antalet studsar som ska utföras.
     *  </li>
     *  <li>
     *      <b>t</b>    Tiden, ticka
     *  </li>
     *  <li>
     *      <b>data</b> Uträkningen lagras i en vektor
     *  </li>
     * </ul>
     *
     * @example
     * var i = 0,
     *     data = C.Animation.bounce(),
     *     animation = function(){
     *          if(i < data.length){
     *              target.style.top = data[i++] + "px";
     *              setTimeout(animation,15);
     *          }
     *      };
     *  animation();
     *
     * @param iH int<br />
     * Initsialhöjden. Var elementet släpps ifrån.
     *
     * @function
     * @static
     * @return Array
     * @type Array
     */
    bounce : function(iH)
    {
        var y       = 0,
            v       = 0,
            y0      = iH,
            v0      = 0,
            g       = 125,
            n       = 0.6,
            s       = 15,
            t       = 0,
            fv0,
            data    = [];

        for(var m = 0; m < s; m++)
        {
            fv0 = v0;
            while(y >= 0)
            {
                y  = y0 + (v0 * t) - (0.5 * g * Math.pow(t,2));
                y  = Math.round(y);
                v  = v0 - (g*t);
                t += 0.1;
                data[data.length] = Math.round(iH - (y < 0 ? 0 : y));
            }
            // Återställer värden inför nästa studs
            y  = 0;
            t  = 0;
            y0 = 0;
            v0 = -v * n;

            if(m > 0 && fv0 < v0)
                break;
        }

        return data;
    },

    /**
     * Funktionen returnerar en array med fallande liknelse.<br />
     * Rörelsen ökar ju längre den fortgår..
     * @type array
     * @return array
     * @static
     * @function
     * @param distance int<br />
     * Den distansen som elementet ska falla
     */
    fall : function(distance)
    {
        var value       = 0,
            t           = 0,
            aniArray    = [];

        while(value < distance)
        {
            t += 0.8;
            value = t*t;
            aniArray[aniArray.length] = Math.round(value);
        }
        return aniArray;
    },

    /**
     * Funktionen returnerar en array med en tråkig konstant rörelse.<br />
     * @type array
     * @return array
     * @static
     * @function
     * @param distance int<br />
     * Den distansen som elementet ska röra sig
     * @param speed int<br />
     * Hastigheten på rörelsen..<br />
     * Default = 1
     */
    constantMotion : function(distance,speed)
    {
        speed = speed || 1;

        var value       = 0,
            aniArray    = [];

        while(value < distance)
        {
            value += speed;
            aniArray[aniArray.length] = Math.round(value);
        }
        return aniArray;
    },
    
    pie : function( distance, speed )
    {
        speed = speed || 0.1;

        var animation = [],
            former    = 0,
            ticker    = 0,
            value;

        while( true )
        {
            ticker += speed
            value   = Math.sin( ticker );

            if( former >= value )
                break;

            former = value;

            animation.push( Math.round( value * distance ));
        }

        if( animation.length > 0)
            animation[ animation.length - 1 ] = distance;

        return animation;
    }
}