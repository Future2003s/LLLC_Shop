"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";

// --- CÁC ICON (Sử dụng SVG nội tuyến để dễ dàng sử dụng) ---
const Folder = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.23A2 2 0 0 0 8.27 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
  </svg>
);
const FileText = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);
const FileImage = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="10" cy="15" r="2" />
    <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
  </svg>
);
const FileVideo = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m10 11 5 3-5 3v-6Z" />
  </svg>
);
const Search = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const UploadCloud = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
    <path d="M12 12v9"></path>
    <path d="m16 16-4-4-4 4"></path>
  </svg>
);
const PlusSquare = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
);
const ChevronRight = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const MoreVertical = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
const X = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// --- CÁC ĐỊNH NGHĨA TYPE VÀ DỮ LIỆU GIẢ ---
type FileType = "folder" | "pdf" | "word" | "excel" | "image" | "video";

interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  modified: string;
  owner: string;
  children?: string[]; // ID của các mục con
  parentId?: string;
  url?: string; // URL để xem trước tệp
}

const initialItems: Record<string, FileSystemItem> = {
  root: {
    id: "root",
    name: "Tài liệu công ty",
    type: "folder",
    size: "",
    modified: "",
    owner: "",
    children: ["1", "2", "3", "4", "5"],
  },
  "1": {
    id: "1",
    name: "Tài chính",
    type: "folder",
    size: "15.2 GB",
    modified: "14/07/2025",
    owner: "Nguyễn Văn A",
    parentId: "root",
    children: ["1-1", "1-2"],
  },
  "1-1": {
    id: "1-1",
    name: "Báo cáo Q2-2025.pdf",
    type: "pdf",
    size: "5.8 MB",
    modified: "11/07/2025",
    owner: "Nguyễn Văn A",
    parentId: "1",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  "1-2": {
    id: "1-2",
    name: "Bảng lương T6.xlsx",
    type: "excel",
    size: "780 KB",
    modified: "15/07/2025",
    owner: "Nguyễn Văn A",
    parentId: "1",
  },
  "2": {
    id: "2",
    name: "Nhân sự",
    type: "folder",
    size: "8.1 GB",
    modified: "12/07/2025",
    owner: "Trần Thị B",
    parentId: "root",
    children: [],
  },
  "3": {
    id: "3",
    name: "Marketing",
    type: "folder",
    size: "25.6 GB",
    modified: "15/07/2025",
    owner: "Lê Văn C",
    parentId: "root",
    children: ["3-1"],
  },
  "3-1": {
    id: "3-1",
    name: "Video giới thiệu sản phẩm mới.mp4",
    type: "video",
    size: "1.1 GB",
    modified: "14/07/2025",
    owner: "Lê Văn C",
    parentId: "3",
  },
  "4": {
    id: "4",
    name: "Hợp đồng ABC.docx",
    type: "word",
    size: "1.2 MB",
    modified: "10/07/2025",
    owner: "Phòng Pháp chế",
    parentId: "root",
  },
  "5": {
    id: "5",
    name: "Ảnh sự kiện team building.zip",
    type: "image",
    size: "2.3 GB",
    modified: "09/07/2025",
    owner: "Phòng Nhân sự",
    parentId: "root",
  },
};

// --- COMPONENT PHỤ ---
const FileIcon = ({ type }: { type: FileType }) => {
  const iconProps = { className: "w-10 h-10" };
  switch (type) {
    case "folder":
      return <Folder {...iconProps} className="text-blue-500" />;
    case "pdf":
      return <FileText {...iconProps} className="text-red-500" />;
    case "word":
      return <FileText {...iconProps} className="text-sky-600" />;
    case "excel":
      return <FileText {...iconProps} className="text-green-600" />;
    case "image":
      return <FileImage {...iconProps} className="text-purple-500" />;
    case "video":
      return <FileVideo {...iconProps} className="text-orange-500" />;
    default:
      return <FileText {...iconProps} className="text-gray-500" />;
  }
};

// --- COMPONENT CHÍNH ---
export default function App() {
  const [allItems, setAllItems] =
    useState<Record<string, FileSystemItem>>(initialItems);
  const [currentPath, setCurrentPath] = useState<string[]>(["root"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewFile, setPreviewFile] = useState<FileSystemItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: FileSystemItem;
  } | null>(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFolderId = currentPath[currentPath.length - 1];
  const currentFolder = allItems[currentFolderId];

  const displayedItems = useMemo(() => {
    const childrenIds = currentFolder?.children || [];
    const items = childrenIds.map((id) => allItems[id]);
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentFolder, allItems, searchTerm]);

  const breadcrumbs = useMemo(() => {
    return currentPath.map((id) => allItems[id]);
  }, [currentPath, allItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (item: FileSystemItem) => {
    if (renamingId === item.id) return;
    if (item.type === "folder") {
      setCurrentPath((prev) => [...prev, item.id]);
    } else {
      setPreviewFile(item);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath((prev) => prev.slice(0, index + 1));
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileSystemItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolderId = `folder-${Date.now()}`;
    const newFolder: FileSystemItem = {
      id: newFolderId,
      name: newFolderName,
      type: "folder",
      size: "-",
      modified: new Date().toLocaleDateString("vi-VN"),
      owner: "Bạn",
      parentId: currentFolderId,
      children: [],
    };
    setAllItems((prev) => ({
      ...prev,
      [newFolderId]: newFolder,
      [currentFolderId]: {
        ...prev[currentFolderId],
        children: [...(prev[currentFolderId].children || []), newFolderId],
      },
    }));
    setIsNewFolderModalOpen(false);
    setNewFolderName("");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processFiles = (files: FileList) => {
    if (!files || files.length === 0) return;

    let newItems: any = {};
    let newChildrenIds: any = [];

    Array.from(files).forEach((file) => {
      const newFileId = `file-${Date.now()}-${Math.random()}`;
      const newFile: FileSystemItem = {
        id: newFileId,
        name: file.name,
        type: "pdf", // Giả lập, có thể xác định loại tệp thực tế
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        modified: new Date().toLocaleDateString("vi-VN"),
        owner: "Bạn",
        parentId: currentFolderId,
      };
      newItems[newFileId] = newFile;
      newChildrenIds.push(newFileId);
    });

    setAllItems((prev) => ({
      ...prev,
      ...newItems,
      [currentFolderId]: {
        ...prev[currentFolderId],
        children: [
          ...(prev[currentFolderId].children || []),
          ...newChildrenIds,
        ],
      },
    }));
  };

  const handleFileUploadFromInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    processFiles(event.target.files as any);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleStartRename = () => {
    if (contextMenu) {
      setRenamingId(contextMenu.item.id);
      setTempName(contextMenu.item.name);
      setContextMenu(null);
    }
  };

  const handleFinishRename = () => {
    if (!renamingId || !tempName.trim()) {
      setRenamingId(null);
      return;
    }
    setAllItems((prev) => ({
      ...prev,
      [renamingId]: {
        ...prev[renamingId],
        name: tempName,
        modified: new Date().toLocaleDateString("vi-VN"),
      },
    }));
    setRenamingId(null);
  };

  return (
    <>
      {/* Modal xem trước tệp */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2
                className="text-xl font-semibold text-gray-900 dark:text-white truncate"
                title={previewFile.name}
              >
                {previewFile.name}
              </h2>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="flex-grow p-4">
              {previewFile.type === "pdf" && previewFile.url ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full"
                  title={previewFile.name}
                ></iframe>
              ) : (
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Loại:</strong> {previewFile.type}
                  </p>
                  <p>
                    <strong>Kích thước:</strong> {previewFile.size}
                  </p>
                  <p>
                    <strong>Sửa đổi lần cuối:</strong> {previewFile.modified}
                  </p>
                  <p>
                    <strong>Sở hữu:</strong> {previewFile.owner}
                  </p>
                  <p className="pt-4 text-gray-500">
                    Không thể xem trước loại tệp này.
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <a
                href={previewFile.url}
                download={previewFile.name}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Tải xuống
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo thư mục mới */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Tạo thư mục mới
            </h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              placeholder="Nhập tên thư mục"
              className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu ngữ cảnh */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 w-48 z-50 border border-gray-200 dark:border-gray-700"
        >
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Tải xuống
          </a>
          <button
            onClick={handleStartRename}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Đổi tên
          </button>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Xóa
          </a>
        </div>
      )}

      <div
        className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Lớp phủ khi kéo thả */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/20 border-4 border-dashed border-blue-500 rounded-2xl flex justify-center items-center z-50 pointer-events-none m-4">
            <div className="text-center">
              <UploadCloud className="w-24 h-24 text-blue-600 mx-auto animate-bounce" />
              <p className="mt-4 text-xl font-semibold text-blue-700">
                Thả tệp vào đây để tải lên
              </p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Quản lý Tệp tin
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tổng quan các tài liệu của công ty.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewFolderModalOpen(true)}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <PlusSquare className="w-5 h-5" />
                <span>Thư mục mới</span>
              </button>
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Tải lên</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUploadFromInput}
                className="hidden"
                multiple
              />
            </div>
          </header>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm trong thư mục hiện tại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>
          </div>

          <nav
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.id}>
                  <div className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4" />}
                    <button
                      onClick={() => handleBreadcrumbClick(index)}
                      className={`ms-1 md:ms-2 hover:text-blue-600 dark:hover:text-white ${
                        index === breadcrumbs.length - 1
                          ? "font-semibold text-gray-800 dark:text-gray-200"
                          : ""
                      }`}
                    >
                      {crumb.name}
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
                className="group relative flex flex-col justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <FileIcon type={item.type} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e, item);
                      }}
                      className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  {renamingId === item.id ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={handleFinishRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleFinishRename();
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="mt-4 w-full bg-gray-100 dark:bg-gray-700 border border-blue-500 rounded-md p-1 text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                    />
                  ) : (
                    <h3
                      className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100 break-words truncate"
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <p>Sửa đổi: {item.modified}</p>
                  <p>Sở hữu: {item.owner}</p>
                </div>
              </div>
            ))}
          </div>

          {displayedItems.length === 0 && (
            <div className="text-center py-16 col-span-full">
              <p className="text-gray-500 dark:text-gray-400">
                Thư mục này trống.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
