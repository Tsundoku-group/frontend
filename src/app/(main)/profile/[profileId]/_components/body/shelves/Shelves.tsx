import React, {ReactNode} from "react";
import {Button} from "@/components/ui/button";
import {CircleCheck, Clock3, EllipsisVertical, Heart, NotebookPen, Star, Trash2} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Image from 'next/image';

type ShelvesSectionProps = {
    title: string;
    books: Partial<Book>[];
    icon: ReactNode;
};

interface Book {
    id: number;
    title: string;
    coverUrl: string;
}

const ShelvesSection = ({title, books, icon}: ShelvesSectionProps) => {
    return (
        <div className="mb-6">
            <div className="flex items-center mb-2 space-x-2">
                <div>{icon}</div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <span className="text-xs cursor-pointer"
                              onClick={(event) => event.stopPropagation()}>
                                    <EllipsisVertical className="h-4 w-4 text-white"/>
                                </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={(event) => {
                                event.stopPropagation();
                            }}>
                            Supprimer<Trash2 className="h-4 w-4 ml-5"/>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="grid grid-cols-7">
                {books.map((book, index) => (
                    <div key={index} className="relative group">
                        <Image
                            src={book.coverUrl || ""}
                            alt={`Couverture de ${book.title ?? "livre inconnu"}`}
                            className="w-28 h-28 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                ))}
                <div className="flex items-center justify-center">
                    <Button
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white text-xl font-semibold transition">
                        +
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Shelves = () => {
    const wishlistBooks: Partial<Book>[] = [
        {coverUrl: "https://covers.openlibrary.org/b/id/8261451-L.jpg"},
        { coverUrl: "https://covers.openlibrary.org/b/id/8228691-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8275316-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8285505-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8284972-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8225633-L.jpg" },
    ];
    const likedBooks: Partial<Book>[] = [
        { coverUrl: "https://covers.openlibrary.org/b/id/8231991-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8284015-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8305032-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8226191-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8234889-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8235731-L.jpg" },
    ];
    const inProgressBooks: Partial<Book>[] = [
        { coverUrl: "https://covers.openlibrary.org/b/id/8234481-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8285416-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8274923-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8225649-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8245163-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8276234-L.jpg" },
    ];
    const readBooks: Partial<Book>[] = [
        { coverUrl: "https://covers.openlibrary.org/b/id/8236453-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8234056-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8274611-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8235741-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8226128-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8285301-L.jpg" },
    ];
    const customListBooks: Partial<Book>[] = [
        { coverUrl: "https://covers.openlibrary.org/b/id/8225126-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8261292-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8234181-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8284093-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8274205-L.jpg" },
        { coverUrl: "https://covers.openlibrary.org/b/id/8235118-L.jpg" },
    ];

    return (
        <div className="p-6 space-y-8">
            <ShelvesSection title="Wishlist" books={wishlistBooks} icon={<Star className="text-yellow-500"/>}/>
            <ShelvesSection title="Aimés" books={likedBooks} icon={<Heart className="text-red-500"/>}/>
            <ShelvesSection title="En cours" books={inProgressBooks} icon={<Clock3 className="text-orange-500"/>}/>
            <ShelvesSection title="Lus" books={readBooks} icon={<CircleCheck className="text-green-500"/>}/>
            <ShelvesSection title="Liste personnalisée" books={customListBooks}
                            icon={<NotebookPen className="text-pink-200"/>}/>
        </div>
    );
};

export default Shelves;