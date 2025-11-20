import React, { useContext, useEffect } from 'react'
import Nav from '../Component/Nav'
import Footer from '../Component/Footer'
import Card from '../Component/Card';
import { listingDataContext } from '../Context/ListingContext';
import { FaStar } from 'react-icons/fa';
import { MdLocalFireDepartment } from 'react-icons/md';

function Home() {
  let {listingData, setListingData, newListData, recommendations, getRecommendations} = useContext(listingDataContext)
  
  useEffect(() => {
    getRecommendations();
  }, []);

  return (
    <div>
     <Nav/>
     
     {/* Recommendations Section */}
     {recommendations && recommendations.length > 0 && (
       <div className='w-[100vw] flex flex-col items-center mt-[250px] md:mt-[180px] mb-12'>
         <div className='w-[95%] max-w-7xl mb-6'>
           <div className='flex items-center gap-3 mb-4'>
             <MdLocalFireDepartment className='text-orange-500 text-2xl' />
             <h2 className='text-3xl font-bold text-gray-800'>Recommended for You</h2>
           </div>
           <p className='text-gray-600 mb-6'>Top-rated hotels based on guest reviews</p>
           <div className='flex items-center justify-start gap-[25px] flex-wrap'>
             {recommendations.map((list) => (
               <Card 
                 key={list._id}
                 title={list.title} 
                 landMark={list.landMark} 
                 city={list.city} 
                 image1={list.image1} 
                 image2={list.image2} 
                 image3={list.image3} 
                 rent={list.rent} 
                 id={list._id} 
                 ratings={list.ratings} 
                 isBooked={list.isBooked} 
                 host={list.host}
               />
             ))}
           </div>
         </div>
       </div>
     )}

     {/* All Listings Section */}
     <div className='w-[100vw] flex flex-col items-center gap-[25px] mb-12'>
       <div className='w-[95%] max-w-7xl'>
         <h2 className='text-3xl font-bold text-gray-800 mb-6'>All Listings</h2>
         <div className='flex items-center justify-center gap-[25px] flex-wrap'>
           {newListData.map((list) => (
             <Card 
               key={list._id}
               title={list.title} 
               landMark={list.landMark} 
               city={list.city} 
               image1={list.image1} 
               image2={list.image2} 
               image3={list.image3} 
               rent={list.rent} 
               id={list._id} 
               ratings={list.ratings} 
               isBooked={list.isBooked} 
               host={list.host}
             />
           ))}
         </div>
       </div>
     </div>
     
     <Footer/>
    </div> 
  )
}

export default Home
