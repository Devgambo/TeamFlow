import Navbar from '@/components/Navbar';
import { useCreateProjectMutation, useGetProjectsQuery } from '@/features/projects/projectApiSlice';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const schema = z.object({
    name: z.string(),
    description: z.string(),
});

function DashboardAdmin() {
    const { data: projects = [], isLoading, isError, error } = useGetProjectsQuery();
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });

    // State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Close modal when clicking outside
    const handleModalClose = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    const handleCreateProject = async (formData) => {
        try {
            console.log(formData)
            const response = await createProject(formData).unwrap();
            toast.success('Project created successfully!');
            reset(); // Reset the form fields
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };


    const handleOpenProject = (projectId) => {
        navigate(`/admin/${projectId}`);
    };


    return (
        <div className="">
            <Navbar />
            {/* Create New Project Button */}
            <div className="w-[20vw] max-w-4xl mx-auto p-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-[#2B0F4E] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#8177A3] transition duration-300"
                >
                    Create Project ➕
                </button>
            </div>

            {/* Modal for Create Project Form */}
            {isModalOpen && (
                <div
                    onClick={handleModalClose}
                    className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50"
                >
                    <div className="bg-white/95 text-black p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Create New Project</h2>
                        <div >
                            <form className="space-y-4" onSubmit={handleSubmit(handleCreateProject)}>
                                <input
                                    {...register('name')}
                                    type="text"
                                    id="name"
                                    placeholder="Project Name"
                                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <textarea
                                    id="description"
                                    {...register('description')}
                                    placeholder="Project Description"
                                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                                <button
                                    disabled={isCreating}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
                                >
                                    {isCreating ? 'Creating...' : 'Create Project'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects Listing */}
            <div className="mx-10">
                <h2 className="text-2xl font-bold text-white/80 mb-6">Projects :</h2>
                {isLoading ? (
                    <p>Loading projects...</p>  // :TODO skeleton
                ) : isError ? (
                    <div className="text-red-500">
                        <p>Error: {error?.data?.message || 'Failed to fetch projects'}</p>
                        <p>Status: {error?.status}</p>
                        <pre>{JSON.stringify(error, null, 2)}</pre>
                    </div>
                ) : projects.length === 0 ? (
                    <p>no projects</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {projects?.data.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => handleOpenProject(project._id)}                       
                                className="col-span-1 bg-white/5 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            >
                                <h3 className="text-xl font-bold text-indigo-600 mb-2">{project.name}</h3>
                                <p className="text-gray-500">{project.description}</p>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}

export default DashboardAdmin;