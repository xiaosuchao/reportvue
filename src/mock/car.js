export default {
  getCarStore: config => {
    return {
      code: 0,
      data: [{
        fAid: 1,
        carStore: '北京利星行(平治)'
      },
      {
        fAid: 2,
        carStore: '望京soho'
      },
      {
        fAid: 3,
        carStore: '绿地中心'
      }
      ]
    }
  },
  getCarInfo: config => {
    return {
      code: 0,
      data: {
        preSaleVehicleCount: 1,
        vehiclesOnTheSpotCount: 2,
        trialDrivingExitCount: 1,
        admissionCount: 3,
        toBeConfirmedCount: 1,
        appearanceCount: 2,
        afterSaleVehicleCount: 1
      },
      msg: '操作成功啦',
      title: '成功',
      type: 'SUCCESS '
    }
  },
  carInfoList: config => {
    return {
      code: 0,
      data: {
        endRow: 6,
        firstPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        lastPage: 1,
        list: [
          { fBrand: '宝马',
            fColor: '粉色',
            fId: 7,
            fModel: 'KTB',
            fPlatenum: '京B00001',
            inDateStr: '2019-03-22 10:29:05' },
          { fBrand: '保时捷',
            fColor: '红色',
            fId: 3,
            fModel: 'SUV',
            fPlatenum: '京A00003',
            inDateStr: '2019-03-21 10:28:01' },
          { fBrand: '宝马',
            fColor: '红色',
            fId: 5,
            fModel: 'LV',
            fPlatenum: '京A00001',
            inDateStr: '2019-03-21 10:28:01' },
          { fBrand: '奔驰',
            fColor: '蓝色',
            fId: 4,
            fModel: 'SUV',
            fPlatenum: '京A33333' },
          { fBrand: '奔驰',
            fColor: '绿色',
            fId: 2,
            fModel: 'LUV',
            fPlatenum: '京A00002',
            inDateStr: '2019-03-22 10:29:05' },
          { fBrand: '奔驰',
            fColor: '红色',
            fId: 6,
            fModel: 'LKV',
            fPlatenum: '京B00006',
            inDateStr: '2019-03-22 10:29:05' },
          { fBrand: '宝马',
            fColor: '粉色',
            fId: 7,
            fModel: 'KTB',
            fPlatenum: '京B00001',
            inDateStr: '2019-03-22 10:29:05' },
          { fBrand: '保时捷',
            fColor: '红色',
            fId: 3,
            fModel: 'SUV',
            fPlatenum: '京A00003',
            inDateStr: '2019-03-21 10:28:01' },
          { fBrand: '宝马',
            fColor: '红色',
            fId: 5,
            fModel: 'LV',
            fPlatenum: '京A00001',
            inDateStr: '2019-03-21 10:28:01' },
          { fBrand: '奔驰',
            fColor: '蓝色',
            fId: 4,
            fModel: 'SUV',
            fPlatenum: '京A33333' }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: [1],
        nextPage: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 3,
        prePage: 0,
        size: 6,
        startRow: 1,
        total: 6
      }
    }
  },
  colorinfo: config => {
    return {
      code: 0,
      data: [
        { value: '蓝色' },
        { value: '绿色' },
        { value: '红色' },
        { value: '粉色' }
      ],
      msg: '操作成功',
      title: '成功',
      type: 'SUCCESS'
    }
  },
  brandinfo: config => {
    return {
      code: 0,
      data: [
        { value: '保时捷' },
        { value: '奔驰' },
        { value: '宝马' }
      ],
      msg: '操作成功',
      title: '成功',
      type: 'SUCCESS'
    }
  },
  modelinfo: config => {
    return {
      code: 0,
      data: [
        { value: 'LUV' },
        { value: 'LKV' },
        { value: 'SUV' },
        { value: 'LV' },
        { value: 'KTB' }
      ],
      msg: '操作成功',
      title: '成功',
      type: 'SUCCESS'
    }
  },
  queoneCar: config => {
    return {
      code: 0,
      data: {
        currentId: -1,
        fAid: '13',
        fBrand: '奔驰',
        fColor: '绿色',
        fCreatedate: 1553065545,
        fFinancialSettlement: '1',
        fId: 2,
        fModel: 'LUV',
        fPlatenum: '京A00002',
        fPresenceStatus: '2',
        fReserveStatus: '2',
        fStatus: '3',
        fapproval: 2,
        forderType: 3,
        inDateStr: '2019-03-22 10:29:05',
        outDateStr: '2019-03-21 11:27:59'
      },
      msg: '操作成功啦',
      title: '成功',
      type: 'SUCCESS'
    }
  },
  innercarList: config => {
    return {
      code: 0,
      data: {
        endRow: 6,
        firstPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        lastPage: 1,
        list: [
          {
            currentId: 0,
            dueDate: '2019-04-12',
            fAid: '',
            fDueTime: 1554998400,
            fFounder: '机构主账号',
            fId: 34,
            fInternalVehicle: 1,
            fOwner: '444444444',
            fPlatenum: 'SSSSSSDD',
            fRemarks: '5555',
            fUnit: '0',
            presenceStatus: 9,
            showRevoke: 2 }, { currentId: 0,
            dueDate: '2019-04-12',
            fAid: 13,
            fDueTime: 1554998400,
            fFounder: '售前经理1',
            fId: 36,
            fInternalVehicle: 1,
            fOwner: 'test',
            fPlatenum: '京A0009',
            fRemarks: 'test',
            fUnit: '0',
            presenceStatus: 9,
            showRevoke: 2 }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 2,
        navigatePages: 8,
        navigatepageNums: [1, 2],
        nextPage: 2,
        pageNum: 1,
        pageSize: 10,
        pages: 2,
        prePage: 0,
        size: 10,
        startRow: 1,
        total: 11
      },
      msg: '操作成功啦',
      title: '成功',
      type: 'SUCCESS'
    }
  }
}

