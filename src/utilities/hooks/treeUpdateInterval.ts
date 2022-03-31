import {useTreeFactory} from 'services/web3';
import {useEffect, useState} from 'react';

export function useTreeUpdateInterval() {
  const [treeUpdateInterval, setTreeUpdateInterval] = useState(0);

  const treeFactory = useTreeFactory();

  useEffect(() => {
    treeFactory.methods
      .treeUpdateInterval()
      .call()
      .then(data => {
        setTreeUpdateInterval(data);
      })
      .catch(e => console.log(e, 'e is here'));
  }, [treeFactory.methods]);

  return treeUpdateInterval;
}
