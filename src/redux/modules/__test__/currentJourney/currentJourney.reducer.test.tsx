import {act, renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import {onBoardingOne} from '../../../../../assets/images';
import {currentJourneyReducer, useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import * as actionsList from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';
import {canUpdateTreeLocation} from 'utilities/helpers/submitTree';
import * as storeHook from 'utilities/hooks/useStore';

describe('currentJourney reducer', () => {
  const initialState = {};

  it('should return the initial state', () => {
    expect(currentJourneyReducer(initialState, {type: ''})).toEqual(initialState);
  });
  it('should handle START_PLANT_SINGLE_TREE', () => {
    const expectedValue = {
      ...initialState,
      isNursery: false,
      isUpdate: false,
      isSingle: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.startPlantSingleTree())).toEqual(expectedValue);
  });
  it('should handle START_PLANT_ASSIGNED_TREE', () => {
    const expectedValue = {
      ...initialState,
      isSingle: true,
      isNursery: false,
      isUpdate: false,
      tree: treeDetail,
      treeIdToPlant: treeDetail.id,
    };
    expect(
      currentJourneyReducer(
        initialState,
        actionsList.startPlantAssignedTree({tree: treeDetail as any, treeIdToPlant: treeDetail.id}),
      ),
    ).toEqual(expectedValue);
  });
  it('should handle START_PLANT_NURSERY', () => {
    const nurseryCount = 3;
    const expectedValue = {
      ...initialState,
      isUpdate: false,
      isNursery: true,
      isSingle: false,
      nurseryCount,
    };
    expect(currentJourneyReducer(initialState, actionsList.startPlantNursery({count: nurseryCount}))).toEqual(
      expectedValue,
    );
  });
  it('should handle SET_TREE_PHOTO', () => {
    const photo = onBoardingOne;
    const photoLocation = {
      latitude: 2003423,
      longitude: 213123123,
    };
    const expectedValue = {
      ...initialState,
      photo,
      photoLocation,
      canDraft: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.setTreePhoto({photo, photoLocation}))).toEqual(
      expectedValue,
    );
  });
  it('should handle SET_TREE_LOCATION', () => {
    const coords = {
      latitude: 200000,
      longitude: 123130,
    };
    const expectedValue = {
      ...initialState,
      location: coords,
      canDraft: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.setTreeLocation({coords}))).toEqual(expectedValue);
  });
  it('should handle DISCARD_UPDATE_NURSERY_LOCATION', () => {
    const expectedValue = {
      ...initialState,
      nurseryContinuedUpdatingLocation: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.discardUpdateNurseryLocation())).toEqual(expectedValue);
  });
  it('should handle SET_TREE_DETAIL_TO_UPDATE', () => {
    const expectedValue = {
      location: {
        latitude: Number(treeDetail?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
        longitude: Number(treeDetail?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
      },
      tree: treeDetail,
      isUpdate: true,
      treeIdToUpdate: treeDetail.id,
      isSingle: treeDetail?.treeSpecsEntity?.nursery !== 'true',
      isNursery: treeDetail?.treeSpecsEntity?.nursery === 'true',
      canUpdateLocation: canUpdateTreeLocation(treeDetail as any, treeDetail?.treeSpecsEntity?.nursery === 'true'),
      nurseryContinuedUpdatingLocation: !canUpdateTreeLocation(
        treeDetail as any,
        treeDetail?.treeSpecsEntity?.nursery === 'true',
      ),
    };
    expect(
      currentJourneyReducer(
        initialState,
        actionsList.setTreeDetailToUpdate({tree: treeDetail as any, treeIdToUpdate: treeDetail.id}),
      ),
    ).toEqual(expectedValue);
  });
  it('should handle CLEAR_JOURNEY', () => {
    expect(currentJourneyReducer(initialState, actionsList.clearJourney())).toEqual(initialState);
  });
  it('should handle REMOVE_JOURNEY_PHOTO', () => {
    const initialState = {
      location: {
        latitude: 2999,
        longitude: 2999,
      },
    };
    const expectedValue = {
      ...initialState,
      photo: undefined,
      photoLocation: undefined,
      canDraft: !!initialState.location,
    };
    expect(currentJourneyReducer(initialState, actionsList.removeJourneyPhoto())).toEqual(expectedValue);
  });
  it('should handle REMOVE_JOURNEY_LOCATION', () => {
    const initialState = {
      photo: onBoardingOne,
      photoLocation: {
        latitude: 2999,
        longitude: 2999,
      },
    };
    const expectedValue = {
      ...initialState,
      location: undefined,
      canDraft: !!(initialState.photo && initialState.photoLocation),
    };
    expect(currentJourneyReducer(initialState, actionsList.removeJourneyLocation())).toEqual(expectedValue);
  });
  it('should handle SET_JOURNEY_FROM_DRAFTS', () => {
    const expectedValue = {
      ...initialState,
      location: {
        latitude: 2000,
        longitude: 2000,
      },
      isSingle: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.setJourneyFromDrafts({journey: expectedValue}))).toEqual(
      expectedValue,
    );
  });
  it('should handle SET_JOURNEY_FROM_DRAFTS, default state', () => {
    const expectedValue = {
      ...initialState,
    };
    expect(currentJourneyReducer(initialState, actionsList.setJourneyFromDrafts({journey: undefined} as any))).toEqual(
      expectedValue,
    );
  });
  it('should handle SUBMIT_JOURNEY_WATCHER', () => {
    const expectedValue = {
      ...initialState,
      submitLoading: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.submitJourneyWatcher())).toEqual(expectedValue);
  });
  it('should handle SET_SUBMIT_JOURNEY_LOADING, loading: true', () => {
    const expectedValue = {
      ...initialState,
      submitLoading: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.setSubmitJourneyLoading(true))).toEqual(expectedValue);
  });
  it('should handle SET_SUBMIT_JOURNEY_LOADING, loading: false', () => {
    const expectedValue = {
      ...initialState,
      submitLoading: false,
    };
    expect(currentJourneyReducer(initialState, actionsList.setSubmitJourneyLoading(false))).toEqual(expectedValue);
  });
});

describe('currentJourney hook', () => {
  const mockDispatch = jest.fn((action: () => void) => {});
  const _spy = jest.spyOn(storeHook, 'useAppDispatch').mockImplementation(() => mockDispatch as any);
  const wrapper = {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{currentJourney: {}}} />,
  };
  const {result} = renderHook(() => useCurrentJourney(), wrapper);
  it('should return state value', () => {
    expect(result.current.journey).toEqual({});
  });
  it('should dispatch dispatchClearJourney', () => {
    act(() => {
      result.current.dispatchClearJourney();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.clearJourney());
  });
  it('should dispatch dispatchRemoveJourneyLocation', () => {
    act(() => {
      result.current.dispatchRemoveJourneyLocation();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.removeJourneyLocation());
  });
  it('should dispatch dispatchRemoveJourneyPhoto', () => {
    act(() => {
      result.current.dispatchRemoveJourneyPhoto();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.removeJourneyPhoto());
  });
  it('should dispatch dispatchSelectTreePhoto', () => {
    act(() => {
      result.current.dispatchSelectTreePhoto({} as any);
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.assignJourneyTreePhotoWatcher({}));
  });
  it('should dispatch dispatchSelectTreeLocation', () => {
    act(() => {
      result.current.dispatchSelectTreeLocation({location: {latitude: 222, longitude: 22}});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      actionsList.assignJourneyTreeLocationWatcher({location: {latitude: 222, longitude: 22}}),
    );
  });
  it('should dispatch dispatchSetTreeDetailToUpdate', () => {
    act(() => {
      result.current.dispatchSetTreeDetailToUpdate({} as any);
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.setTreeDetailToUpdate({} as any));
  });
  it('should dispatch dispatchStartPlantAssignedTree', () => {
    act(() => {
      result.current.dispatchStartPlantAssignedTree({tree: treeDetail as any, treeIdToPlant: 'X'});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      actionsList.startPlantAssignedTree({tree: treeDetail as any, treeIdToPlant: 'X'}),
    );
  });
  it('should dispatch dispatchStartPlantNursery', () => {
    act(() => {
      result.current.dispatchStartPlantNursery({count: 2});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.startPlantNursery({count: 2}));
  });
  it('should dispatch dispatchStartPlantSingleTree', () => {
    act(() => {
      result.current.dispatchStartPlantSingleTree();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.startPlantSingleTree());
  });
  it('should dispatch dispatchSubmitJourney', () => {
    act(() => {
      result.current.dispatchSubmitJourney();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.submitJourneyWatcher());
  });
});
