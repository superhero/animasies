/*
  Animasies - Javascript - Animation calculations
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

/* This class containes static funktions that can be used in animations
 * 
 * @class
 * @static
 */
var Animasies =
{
  /* The Normal distribution curve, Gaussian curve,
   * General normal distribution curve, Bell curve
   * 
   * @param length int The length of the animation
   * 
   * @param position float [optional] A decimal number between 0 - 1 that
   * tells where the curve should have its peak, where the speed is the
   * highest. The middle is 0.5. Default value set to 0.5
   *
   * @function
   * @static
   * @return Array
   * @type Array
   */
  bell : function( length, position )
  {
    position = position || 0.5;
    
    var negative = length < 0;
    length = Math.abs( length );
    
    var 
    h = length / ((( 180 / 3395 ) * length ) + 84.09425626 ),
    s = length / 10,
    j = length * position,
    x = [],
    y = [],
    z,
    v,
    u = [],
    tmp = length - ( length % h ),
    cumsum = function(vector)
    {
      var cumsum  = [];
      cumsum[ 0 ] = vector[ 0 ];
      for( var i = 1, n = vector.length; i < n; i++ )
        cumsum[ i ] = cumsum[ i - 1 ] + vector[ i ];
        
      return cumsum;
    };
      
    for(var n = 0, i = 0; n < tmp; n += h, i++)
      x[ i ] = n;
    x[ i ] = length;

    tmp = h*(1/(s*(Math.sqrt(2*Math.PI))));
    for( n in x )
      y.push( 
        tmp 
        * Math.exp(
          ( Math.pow( x[ n ] - j, 2 ) 
          / Math.pow( 2 * s, 2 )
          ) * -1 ));

    z = cumsum( y );
    v = length / z[ z.length - 1 ];
    
    for( n in z )
      u[ n ] = Math.round( v * z[ n ]) * ( negative ? -1 : 1 );

    if( u.length > 0 )
      u[ u.length-1 ] = length * ( negative ? -1 : 1 );

    return u;
  },

  /* The functionen returns an array of the damped oscillation movement
   * 
   * @param height int The initial amplitude, describes from what height the
   * object is droped from.
   * 
   * @param attenuation float [optional] The attenuation that the
   * oscillationen will have. Default value set to 0.7
   * 
   * @param frequency float [optional] The natural oscillation, how light the
   * oscillation should be. Default value set to 1.8
   *
   * @function
   * @static
   * @return Array
   * @type Array
   */
  dampedOscillation : function( height, attenuation, frequency )
  {
    attenuation = attenuation || 0.7;
    attenuation = Math.abs( attenuation ) * -1;
    
    frequency   = frequency || 1.8;
    frequency   = Math.abs( frequency );
    
    var 
    negative = height < 0,
    t        = 0,
    yv       = [],
    r;
    
    height = Math.abs( height );

    do 
    {
      t += 0.1;
      r  = height
         * Math.pow( 
          Math.E,
          attenuation * t )
         * Math.cos(( frequency * t ) + Math.PI );
        
      yv.push( Math.round( r ) * ( negative ? -1 : 1 ));
    }
    while( Math.abs( r ) >= 0.005 );

    return yv;
  },

  /* Basic jump and fall movement 
   * 
   * @param distance int The distance we wish to animate
   *
   * @function
   * @static
   * @return Array
   * @type Array
   */
  curtainClose : function( distance )
  {
    var 
    negative = distance < 0,
    value    = 0,
    t        = 0,
    pull     = 0,
    ani      = [];
    
    distance = Math.abs( distance );

    while( value < distance )
    {
      t    += 0.8;
      pull += 10;
      value = t * t - pull;
      ani.push( Math.round( value ) * ( negative ? -1 : 1 ));
    }
    
    if( ani.length > 0 )
      ani[ ani.length - 1 ] = distance * ( negative ? -1 : 1 );
    
    return ani;
  },

  /* A bouncing movement
   *
   * @param height int Initial height. Where the element is beeing droped
   * from.
   *
   * @param gravity float [optional] The gravity. Default value set to 125.
   * 
   * @param remainingForce float [optional] The force that will push the
   * element up when the element hits the bottom bounce expressed in percent.
   * Default value set to 0.6.
   * 
   * @param max int [optional] The maximum amount of bounces that can accure
   * before the loop ends. Default value set to 15.
   * 
   * @function
   * @static
   * @return Array
   * @type Array
   */
  bounce : function( height, gravity, remainingForce, max )
  {
    gravity = gravity || 125;
    gravity = Math.abs( gravity );
    
    remainingForce = remainingForce || 0.6;
    remainingForce = Math.abs( remainingForce );
    
    max = max || 15;
    max = Math.abs( max );
    
    var negative = height < 0;
    height = Math.abs( height );
    
    var 
    y    = 0,
    v    = 0,
    y0   = height,
    v0   = 0,
    t    = 0,
    fv0,
    data = [];

    for( var i = 0; i < max; i++ )
    {
      fv0 = v0;
      while( y >= 0 )
      {
        y  = y0 + ( v0 * t ) - ( 0.5 * gravity * Math.pow( t, 2 ));
        y  = Math.round( y );
        v  = v0 - ( gravity * t );
        t += 0.1;
        data.push( Math.round( height - ( y < 0 ? 0 : y )) * ( negative ? -1 : 1 ) );
      }
      
      // Reset before next bounce
      y  = 0;
      t  = 0;
      y0 = 0;
      v0 = -v * remainingForce;

      if( i > 0 && fv0 < v0 )
        break;
    }
    
    if( data.length > 0 )
      data[ data.length - 1 ] = height * ( negative ? -1 : 1 );

    return data;
  },

  /* Basic falling movement
   * 
   * @param distance int The distance that the element should fall
   * 
   * @function
   * @static
   * @return Array
   * @type Array
   */
  fall : function( distance )
  {
    var 
    negative = distance < 0,
    value    = 0,
    t        = 0,
    ani      = [];
    
    distance = Math.abs( distance );

    while( value < distance )
    {
      t    += 0.8;
      value = t * t;
      
      ani.push( Math.round( value ) * ( negative ? -1 : 1 ));
    }
    
    if( ani.length > 0 )
      ani[ ani.length - 1 ] = distance * ( negative ? -1 : 1 );
    
    return ani;
  },

  /* Constant motion
   * 
   * @param distance int The distance that the element should move
   * 
   * @param speed int [optional] The speed of the movement. Default value set
   * to 1.
   * 
   * @function
   * @static
   * @return Array
   * @type Array
   */
  constantMotion : function( distance, speed )
  {
    speed = speed || 1;
    speed = Math.abs( speed );
    
    var 
    negative = distance < 0,
    value    = 0,
    ani      = [];
    
    distance = Math.abs( distance );

    while( value < distance )
    {
      value += speed;
      ani.push( Math.round( value ) * ( negative ? -1 : 1 ) );
    }
    
    if( ani.length > 0 )
      ani[ ani.length - 1 ] = distance * ( negative ? -1 : 1 );
    
    return ani;
  },
  
  /* Half of a sinus curve
   * 
   * @param distance int The distance we wish to animate
   * 
   * @param speed [optional] int The speed of the movement. Default value set
   * to 1.
   * 
   * @function
   * @static
   * @return Array
   * @type Array
   */
  pie : function( distance, speed )
  {
    speed  = speed || 1;
    speed /= 10;

    var 
    negative = distance < 0,
    ani      = [],
    former   = 0,
    ticker   = 0,
    value;
    
    distance = Math.abs( distance );

    while( true )
    {
      ticker += speed
      value   = Math.sin( ticker );

      if( former >= value )
        break;

      former = value;

      ani.push( Math.round( value * distance ) * ( negative ? -1 : 1 ) );
    }

    if( ani.length > 0 )
      ani[ ani.length - 1 ] = distance * ( negative ? -1 : 1 );

    return ani;
  },
  
  /* A positive sinus curve
   * 
   * @param distance int The distance we wish to animate
   * 
   * @param speed int [optional] The speed of the movement. Default value set
   * to 1.
   * 
   * @function
   * @static
   * @return Array
   * @type Array
   */
  halfMoon : function( distance, speed )
  {
    speed  = speed || 1;
    speed /= 10;

    var 
    negative = distance < 0,
    ani      = [],
    former   = 0,
    ticker   = ( Math.PI / 2 ) * - 1,
    value;
    
    distance = Math.abs( distance );

    while( true )
    {
      ticker += speed
      value   = ( Math.sin( ticker ) + 1 ) / 2;

      if( former >= value )
        break;

      former = value;

      ani.push( Math.round( value * distance ) * ( negative ? -1 : 1 ) );
    }

    if( ani.length > 0 )
      ani[ ani.length - 1 ] = distance * ( negative ? -1 : 1 );

    return ani;
  }
}