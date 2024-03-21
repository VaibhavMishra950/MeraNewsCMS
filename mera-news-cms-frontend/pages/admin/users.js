import React, { useEffect, useState } from 'react'
import AdminApp from '@/pages/admin/adminContainer';
import { Pencil, PencilLine, Plus, Trash2, UserRoundMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import userImage from "@/img/sample_user.jpg";

const AdminUsersComponent = ({ user }) => {

    const [editors, setEditors] = useState([]);
    const [viewers, setViewers] = useState([]);
    const [allViewers, setAllViewers] = useState([]);
    const [showAddBox, setShowAddBox] = useState(false);
    const [showEditBox, setShowEditBox] = useState(false);

    // States for "Edit Editor Details"
    const [editFirstname, setEditFirstname] = useState("");
    const [editLastname, setEditLastname] = useState("");
    const [editStatus, setEditStatus] = useState(true);
    const [editUsername, setEditUsername] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editMobile, setEditMobile] = useState("");

    const getAndSetEditors = async () => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/getEditors`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.value })
        });
        let data = await res.json();
        if (data.success) {
            setEditors(data.editors)
        }
    }

    useEffect(() => {
        getAndSetEditors();
    }, [])

    const handleAddDivClick = function (e) {
        setShowAddBox(e.target != e.currentTarget);
    }

    const handleAddEditorBtnClick = async () => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/getViewers`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.value })
        });
        let data = await res.json();
        if (data.success) {
            setAllViewers(data.viewers);
            setViewers(data.viewers);
            setShowAddBox(true);
        } else {
            toast.error(data.message);
        }
    }

    const handleSearchInputChange = (e) => {
        let x = e.target.value;
        if (x.trim().toLowerCase().length > 0) {
            setViewers(allViewers.filter(viewer => {
                return viewer.username.includes(x.trim().toLowerCase())
            }))
        } else {
            setViewers(allViewers)
        }
    }

    const handleMakeEditorButton = async (username) => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/promoteUserToEditor`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.value, uname: username })
        });
        let data = await res.json();
        if (data.success) {
            toast.success(`${username} promoted as Editor.`)
            getAndSetEditors();
            setShowAddBox(false);
        } else {
            toast.error(data.message);
        }
    }

    const handleEditDivClick = function (e) {
        setShowEditBox(e.target != e.currentTarget);
    }

    const handleEditorEditButtonClick = (editor) => {
        setShowEditBox(true);
        setEditUsername(editor.username);
        setEditEmail(editor.email);
        setEditMobile(editor.mobile);
        setEditFirstname(editor.firstname);
        setEditLastname(editor.lastname);
        setEditStatus(editor.status);
    }

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        if (editFirstname != "" && editLastname != "") {
            let data = { token: user.value, editUsername, editFirstname, editLastname, editStatus };
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/updateUser`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let result = await res.json();
            if (result.success) {
                toast.success("Details Updated Successfully.");
                getAndSetEditors();
                setShowEditBox(false);
            } else {
                toast.error(result.message);
            }
        } else {
            toast.error("All fields are required!")
        }
    }

    const handleEditorDeleteButtonClick = async (uname) => {
        if (confirm(`Do you really want to delete this @${uname}?`)) {
            let data = { token: user.value, uname };
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/deleteUser`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let result = await res.json();
            if (result.success) {
                toast.success("Editor deleted Successfully.");
                getAndSetEditors();
            } else {
                toast.error(result.message);
            }
        }
    }

    const handleEditorDemoteButtonClick = async (uname) => {
        if (confirm(`Do you really want to demote @${uname} to user?`)) {
            let data = { token: user.value, uname };
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/demoteEditorToUser`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let result = await res.json();
            if (result.success) {
                toast.success("Editor demoted as User Successfully.");
                getAndSetEditors();
            } else {
                toast.error(result.message);
            }
        }
    }


    return <div className='p-5 bg-gray-950/50 w-full h-full'>
        {/* Modal for adding the editor */}
        {showAddBox && <div onClick={handleAddDivClick} className='fixed top-0 left-0 flex items-center justify-center bg-gray-900/25 backdrop-blur-sm w-screen h-screen'>
            <div className='bg-gray-950 border border-gray-700 rounded-2xl p-3 w-[440px] h-[calc(100vh-20%)]'>
                <p className="text-white text-xl text-center"> Promote User to Editor </p>
                <div className="my-3">
                    <input
                        className="flex h-10 w-full rounded-md bg-gray-900 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 focus:ring-offset-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder="Search username"
                        onChange={handleSearchInputChange}
                    ></input>
                </div>
                <div className='h-[360px] overflow-y-scroll px-2'>
                    <div className='flex flex-col gap-2 my-4'>
                        {viewers.map(viewer => {
                            return <div key={viewer.username} className="flex items-center justify-between">
                                <span className='flex items-center space-x-2'>
                                    <img
                                        className="inline-block h-12 w-12 rounded-full"
                                        src={viewer.image ? `${process.env.NEXT_PUBLIC_SERVER_HOST}/userProfiles/${viewer.image}` : userImage.src}
                                        alt={viewer.name}
                                    />
                                    <span className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-200">{`${viewer.firstname} ${viewer.lastname}`}</span>
                                        <span className="text-sm font-medium text-gray-400">@{viewer.username}</span>
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md bg-blue-800/90 px-3 py-2 text-sm text-white hover:bg-blue-800/80"
                                    onClick={() => { handleMakeEditorButton(viewer.username) }}
                                >
                                    Make editor
                                    <Pencil className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        })}

                    </div>
                </div>
            </div>
        </div>}

        {/* Modal for editing the editor */}
        {showEditBox && <div onClick={handleEditDivClick} className='fixed top-0 left-0 flex items-center justify-center bg-gray-900/25 backdrop-blur-sm w-screen h-screen'>
            <div className='bg-gray-950 border border-gray-700 rounded-2xl p-3 w-[440px] h-[calc(100vh-20%)]'>
                <p className="text-white text-xl text-center"> Edit editor details </p>
                <form onSubmit={handleEditFormSubmit} className="max-w-sm mx-auto mt-10">
                    <div className="mb-5">
                        <label className="block mb-2 text-base font-medium text-gray-50">
                            Username:
                            <span className='text-gray-400' > @{editUsername}</span>
                        </label>
                        <label className="block mb-2 text-base font-medium text-gray-50">
                            Mobile:
                            <span className='text-gray-400' > {editMobile}</span>
                        </label>
                        <label className="block mb-2 text-base font-medium text-gray-50">
                            Email ID:
                            <span className='text-gray-400' > {editEmail}</span>
                        </label>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                        <input value={editFirstname} onChange={(e) => { setEditFirstname(e.target.value) }} name='firstname' type="text" id="firstname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                        <input value={editLastname} onChange={(e) => { setEditLastname(e.target.value) }} name='lastname' type="text" id="lastname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>

                    <div className="mb-5">
                        <label className='flex cursor-pointer select-none items-center gap-2 w-fit'>
                            <span className='block text-lg text-gray-900 dark:text-white'>Active Status: </span>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={editStatus}
                                    onChange={() => { setEditStatus(!editStatus) }}
                                    className='sr-only'
                                />
                                <div className='block h-8 w-14 rounded-full bg-gray-800'></div>
                                <div className={`dot absolute ${editStatus ? 'left-7' : 'left-1'} top-1 h-6 w-6 rounded-full ${editStatus ? 'bg-blue-600' : 'bg-white'} transition-all duration-100`}></div>
                            </div>
                        </label>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-800 dark:hover:bg-blue-800/90 dark:focus:ring-blue-800">Save Details</button>
                </form>
            </div>
        </div>}

        {/* Main Box */}
        <section className="mx-auto w-full max-w-7xl px-4 py-4">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h2 className="text-lg">Editors</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        This is a list of all editors. You can add new editors, edit or delete existing
                        ones.
                    </p>
                </div>
                <div>
                    <button
                        type="button"
                        className="flex items-center gap-1 rounded-md bg-blue-800/90 px-3 py-2 text-sm  text-white shadow-sm hover:bg-blue-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        onClick={handleAddEditorBtnClick}
                    >
                        <Plus size={18} /> Add new editor
                    </button>
                </div>
            </div>
            <div className="mt-6 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-950 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-950">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-400"
                                        >
                                            <span>Editor</span>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-400"
                                        >
                                            Contact
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-400"
                                        >
                                            Status
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-400"
                                        >
                                            Username
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-400"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-950 bg-gray-900">
                                    {editors.map((editor) => (
                                        <tr key={editor.username}>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={editor.image ? `${process.env.NEXT_PUBLIC_SERVER_HOST}/userProfiles/${editor.image}` : userImage.src}
                                                            alt={editor.firstname}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-200">{editor.firstname + " " + editor.lastname}</div>
                                                        <div className="text-sm text-gray-400">{editor.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-12 py-4">
                                                <div className="text-sm text-gray-200 ">{editor.mobile}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                {editor.status ? <span className="inline-flex rounded-full bg-green-400/20 px-2 text-xs leading-5 text-green-400">
                                                    Active
                                                </span> :
                                                    <span className="inline-flex rounded-full bg-red-400/20 px-2 text-xs leading-5 text-red-400">
                                                        Inactive
                                                    </span>}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-200">
                                                {editor.username}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4 text-left text-sm font-medium flex gap-1">
                                                <button onClick={() => { handleEditorEditButtonClick(editor) }} title='Edit' className="rounded-full bg-blue-500/80 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                    <PencilLine size={16} />
                                                </button>
                                                <button onClick={() => { handleEditorDemoteButtonClick(editor.username) }} title='Demote editor to user' className="rounded-full bg-violet-500/80 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                    <UserRoundMinus size={16} />
                                                </button>
                                                <button onClick={() => { handleEditorDeleteButtonClick(editor.username) }} title='Delete' className="rounded-full bg-red-500/80 px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
}

const Users = ({ user }) => <AdminApp user={user} Component={AdminUsersComponent} pageProps={{ user }} />

export default Users;