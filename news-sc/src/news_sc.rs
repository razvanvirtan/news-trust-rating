#![no_std]

#[allow(unused_imports)]
use multiversx_sc::imports::*;
multiversx_sc::derive_imports!();

#[type_abi]
#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode)]
struct NewsVotes<M>
where
    M: ManagedTypeApi
{
  total_votes: BigUint<M>,
  trust_votes: BigUint<M>
}

const SCALE_FACTOR: u64 = 1_000;

#[multiversx_sc::contract]
pub trait NewsSc {
    #[init]
    fn init(&self) {}

    #[upgrade]
    fn upgrade(&self) {}

    #[view(getRating)]
    fn get_rating(&self, url: ManagedBuffer<Self::Api>) -> BigUint<Self::Api> {
        let votes = self.ratings(&url).get();
        let scaled_trust_votes = &votes.trust_votes * &BigUint::from(SCALE_FACTOR);
        let scaled_rating = &scaled_trust_votes / &votes.total_votes;
       
       scaled_rating
    }

    #[endpoint(vote)]
    fn vote(&self, url: ManagedBuffer<Self::Api>, trust: bool) {
        self.ratings(&url).set_if_empty( NewsVotes { total_votes: BigUint::from(0u64),  trust_votes: BigUint::from(0u64)});

        self.ratings(&url).update(|votes| 
            { votes.total_votes += BigUint::from(1u64);       
              if trust {
                votes.trust_votes += BigUint::from(1u64);
                }
            } 
        );
    }

    #[storage_mapper("ratings")]
    fn ratings(&self, url: &ManagedBuffer<Self::Api>) -> SingleValueMapper<NewsVotes<Self::Api>>;
}
