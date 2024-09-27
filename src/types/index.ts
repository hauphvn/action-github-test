export interface IProduct {
    productID: string;
    productName: string;
    productCode?: string;
    store?: string;
    warranty?: string;
    unit?: string;
    importPrice?: string;
    salePrice: string;
    discount?: string;
    priceAfterDiscount?: string;
    quantity?: string;
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
    isContactPrice?: boolean;
    isOnlineSale?: boolean;
}

export interface IProductDetails {
    Cao?: number;
    Dai?: number;
    GiaBan?: number;
    GiaSauGiam?: number;
    GiaTriTienTe?: string;
    GiamGia?: number;
    IDCuaHang?: number;
    IDDonViTinh?: number;
    IDSanPham?: number;
    KhoiLuong?: number;
    KhoiLuong1?: number;
    MaSanPham?: string;
    MoTa?: string;
    Rong?: number;
    SanPhamTrucTuyen?: number;
    SoLuong?: number;
    TenSanPham?: string;
    ThoiGianBaoHanh?: number;
    TriGia?: number;
    URLImage?: string;
    URLImage2?: string;
    URLImage3?: string;
    URLImage4?: string;
    URLImage5?: string;
    actionType?: string;
}
export interface INewProductRequest {
    tensanpham: string;
    sanphamtructuyen: number;
    soluong: number;
    trigia: number;
    giaban: number;
    iddonvitinh: number;
    idcuahang: number;
    giatritiente: string;
    mota: string;
    giamgia: number;
    thoigianbaohanh: number;
    khoiluong: number;
    dai: number;
    rong: number;
    cao: number;
    idnguoidung?: number;
    type?: string;
    type2?: string;
    type3?: string;
    type4?: string;
    type5?: string;
}
export interface IProductUpdateRequest {
    masanpham: string;
    tensanpham: string;
    sanphamtructuyen: number;
    soluong: number;
    trigia: number;
    giaban: number;
    iddonvitinh: number;
    idcuahang: number;
    giatritiente: string;
    mota: string;
    giamgia: number;
    thoigianbaohanh: number;
    khoiluong: number;
    dai: number;
    rong: number;
    cao: number;
    idnguoidung?: number;
    idsanpham: number;
    type?: string;
    type2?: string;
    type3?: string;
    type4?: string;
    type5?: string;
}
export interface IImageUpdateRequest {
    file1?: any,
    file2?: any,
    file3?: any,
    file4?: any,
    file5?: any,
    filename?:(string|undefined)[],
    filenamedelete?:(string|undefined)[],
    loai?: number,
    oldtypes?:(string|undefined)[]
}
export interface IResProduct {
    key: string;
    productID: string;
    productName: string;
    image: string;
    productCode: string;
    amount: string;
    price: string;
}

export interface IResProductEditSelected {
    productID: string;
    productName: string;
    productCode: string;
    quantity: string;
    actionType: 'update' | 'delete' | 'import-warehouse' |'printer' | 'unknown';
    salePrice: string;
}
export interface UserInfo {
    IDNguoiDung: number;
    TaiKhoan: string;
    MatKhau: string;
    Ho: string;
    Ten: string;
    GioiTinh: number;
    TenNguoiDung: string | null;
    DienThoai: string | null;
    Email: string;
    CMND: string | null;
    NgaySinhNhat: string;
    IDVaiTro: number;
    VaiTro: string;
    IDCuaHang: number;
    ChuDe: string;
    DiaChi: string | null;
    ThanhPho: string | null;
    DienThoaiKhachHang: string;
    EmailKhachHang: string | null;
    TenQuan: string | null;
    TenBang: string | null;
    TenKhachHang: string;
    MaQuocGia: string | null;
    TenQuocGia: string | null;
    MaBang: string | null;
    IDKhachHang: number;
    NhanEmail: number;
}

export interface Role {
    RoleId: number;
    RoleName: string;
    RoleCode: string;
    RolesChild: never[];
}
export interface StoreInfo {
    IDCuaHang: number;
    MaCuaHang: string;
    TenCuaHang: string;
    URLLogo: string;
    DiaChiCuaHang: string;
    DienThoaiCuaHang: string;
    EmailCuaHang: string;
    TenNguoiDaiDienCuaHang: string;
    DiaChiWebCuaHang: string;
    IDCuaHangCha?: number | null;
    CapDoCuaHang?: number | null;
    ThanhPho: string;
    MaBang: string;
    MaQuocGia: string;
    TenBang: string;
    TenQuocGia: string;
    TenQuan: string;
}

export interface Permission {
    IdchuyenMuc: number;
    MaChuyenMuc: string;
    TenChuyenMuc: string;
    LoaiChuyenMuc: string;
    CapDoChuyenMuc: number;
    Thuoc: string;
    MinWidthScreen: number;
    NgayHeThong: string;
    IsFavoriteMenu: boolean;
    IsFastMenu: boolean;
}

export interface UserData {
    UserInfo: UserInfo;
    StoreInfo: StoreInfo;
    Role: Role;
    Permissions: Permission[];
    Token: string;
    RefreshToken: string;
    EnvTypeCode: string;
    ApiUrl: string;
}

export interface IEditProductImageRequest {
    folder: string,
    filesDelete: string[],
    filesUpdate: {
        file: any,
        filename: string
    }[]
}
