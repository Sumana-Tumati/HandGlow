import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div>
      <section className="hero">
        <div className="content">
          <h1>Handmade Candles for cozy moments</h1>
          <p>Our candles are poured with natural wax and scented with care. Browse our collection and find your new favorite scent.</p>
          <Link to="/shop"><button className="cta">Shop candles</button></Link>
        </div>
        <div className="image">
          <img
            src="/img/main1.svg"
            alt="candles"
            className="hero-image"
            width={280}
            height={186}
            loading="lazy"
          />
        </div>
      </section>
      <section style={{marginTop:16}}>
        <h2>Featured</h2>
        <p style={{color:'rgba(59,47,47,0.7)'}}>Curated favorites</p>
        <div className="grid">
          {/* featured cards: curated favorites */}
          {[
            {
              title: 'Jasmine Cube Candle',
              img: '/img/jasmine.jpg',
              desc: 'A delicate jasmine-scented cube for calming evenings.',
              price: 199
            },
            {
              title: 'Rose Rose Candle',
              img: '/img/rose.jpg',
              desc: 'Romantic rose fragrance with a soft, lasting glow.',
              price: 169
            },
            {
              title: 'Ylang-Ylang Mini Cube Candle',
              img: '/img/ylang.jpg',
              desc: 'Mini cube candle with exotic ylang-ylang aroma.',
              price: 49
            },
            {
              title: 'Sandalwood Pillar Candle',
              img: '/img/sandalwood.jpg',
              desc: 'Warm sandalwood pillar for grounding ambience.',
              price: 159
            }
          ].map((p, idx) => (
            <div className="card" key={idx}>
              <img src={p.img} alt={p.title} className="featured-img" loading="lazy" width={400} height={300} />
              <h3>{p.title}</h3>
              <p style={{color:'rgba(59,47,47,0.7)',marginTop:6,fontSize:14}}>{p.desc}</p>
              <div className="price">₹{p.price}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
